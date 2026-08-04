import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/session_service.dart';

class ClienteScreen extends StatefulWidget {
  final String token;
  final String username;
  const ClienteScreen({super.key, required this.token, required this.username});

  @override
  State<ClienteScreen> createState() => _ClienteScreenState();
}

class _ClienteScreenState extends State<ClienteScreen> {
  final Map<int, int> _cart = {};
  List<dynamic> _productos = [];
  List<dynamic> _categorias = [];
  List<dynamic> _ventas = [];
  bool _loading = true;
  bool _buying = false;
  String _selectedCat = 'all';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final productos = await ApiService.fetchProductos(widget.token);
    final categorias = await ApiService.fetchCategorias(widget.token);
    final ventas = await ApiService.fetchVentas(widget.token);
    setState(() {
      _productos = productos;
      _categorias = categorias;
      _ventas = ventas;
      _loading = false;
    });
  }

  int get _cartCount => _cart.values.fold(0, (a, b) => a + b);

  double get _cartTotal {
    double total = 0;
    _cart.forEach((id, qty) {
      final p = _productos.firstWhere((prod) => prod['id'] == id, orElse: () => {});
      if (p.isNotEmpty) {
        total += (double.tryParse(p['precio_unitario'].toString()) ?? 0) * qty;
      }
    });
    return total;
  }

  Future<void> _comprar() async {
    if (_cart.isEmpty) return;
    setState(() => _buying = true);

    double total = 0;
    final detalles = <Map<String, dynamic>>[];

    _cart.forEach((id, qty) {
      final p = _productos.firstWhere((prod) => prod['id'] == id);
      final precio = double.tryParse(p['precio_unitario'].toString()) ?? 0;
      total += precio * qty;
      detalles.add({
        'producto': id,
        'cantidad': qty,
        'precio_unitario_historico': precio.toStringAsFixed(2),
        'subtotal': (precio * qty).toStringAsFixed(2),
      });
    });

    final success = await ApiService.crearVenta(widget.token, total, 'Completado', detalles);
    setState(() => _buying = false);

    if (success) {
      setState(() => _cart.clear());
      _load();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ ¡Compra realizada! Total: \$${total.toStringAsFixed(2)}'), backgroundColor: Colors.green),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al realizar la compra'), backgroundColor: Colors.red),
      );
    }
  }

  Future<void> _logout() async {
    await SessionService.clearSession();
    if (mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    }
  }

  String _getCategoriaNombre(dynamic cat) {
    if (cat is Map) return cat['nombre']?.toString() ?? '';
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedCat == 'all'
        ? _productos
        : _productos.where((p) => p['categoria'] is Map ? p['categoria']['id'] == int.tryParse(_selectedCat) : p['categoria'] == int.tryParse(_selectedCat)).toList();

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.grey.shade50,
        appBar: AppBar(
          backgroundColor: Colors.indigo,
          foregroundColor: Colors.white,
          title: Row(children: const [Icon(Icons.bolt), SizedBox(width: 8), Text('Tienda Electronic')]),
          actions: [
            IconButton(
              onPressed: _logout,
              icon: const Icon(Icons.logout),
              tooltip: 'Cerrar sesión',
            ),
          ],
          bottom: const TabBar(tabs: [
            Tab(icon: Icon(Icons.store), text: 'Tienda'),
            Tab(icon: Icon(Icons.receipt), text: 'Mis compras'),
          ]),
        ),
        body: _loading
            ? const Center(child: CircularProgressIndicator(color: Colors.indigo))
            : TabBarView(
                children: [
                  _buildTienda(filtered),
                  _buildMisCompras(),
                ],
              ),
        floatingActionButton: _cartCount > 0
            ? FloatingActionButton.extended(
                backgroundColor: Colors.green,
                onPressed: _buying ? null : _comprar,
                icon: _buying
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.shopping_cart_checkout),
                label: Text('Comprar \$${_cartTotal.toStringAsFixed(2)}'),
              )
            : null,
      ),
    );
  }

  Widget _buildTienda(List<dynamic> filtered) {
    return Column(
      children: [
        // Filtro de categorías
        SizedBox(
          height: 50,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            children: [
              ChoiceChip(
                label: const Text('Todos'),
                selected: _selectedCat == 'all',
                onSelected: (_) => setState(() => _selectedCat = 'all'),
                selectedColor: Colors.indigo,
                labelStyle: TextStyle(color: _selectedCat == 'all' ? Colors.white : Colors.black87),
              ),
              const SizedBox(width: 8),
              ..._categorias.map((cat) => Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(cat['nombre']?.toString() ?? ''),
                  selected: _selectedCat == cat['id'].toString(),
                  onSelected: (_) => setState(() => _selectedCat = cat['id'].toString()),
                  selectedColor: Colors.indigo,
                  labelStyle: TextStyle(color: _selectedCat == cat['id'].toString() ? Colors.white : Colors.black87),
                ),
              )),
            ],
          ),
        ),
        Expanded(
          child: filtered.isEmpty
              ? const Center(child: Text('No hay productos'))
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final p = filtered[index];
                    final id = p['id'] as int;
                    final nombre = p['nombre']?.toString() ?? '';
                    final descripcion = p['descripcion']?.toString() ?? '';
                    final precio = double.tryParse(p['precio_unitario'].toString()) ?? 0;
                    final stock = p['stock_disponible'] ?? 0;
                    final cantidad = _cart[id] ?? 0;
                    final agotado = stock <= 0;
                    final categoria = _getCategoriaNombre(p['categoria']);

                    return Card(
                      elevation: 0,
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: BorderSide(color: Colors.grey.shade200),
                      ),
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(children: [
                              Container(
                                width: 48, height: 48,
                                decoration: BoxDecoration(color: Colors.indigo.shade50, borderRadius: BorderRadius.circular(12)),
                                child: const Icon(Icons.memory, color: Colors.indigo),
                              ),
                              const SizedBox(width: 12),
                              Expanded(child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(nombre, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                                  if (categoria.isNotEmpty)
                                    Text(categoria, style: TextStyle(fontSize: 12, color: Colors.indigo.shade600)),
                                ],
                              )),
                            ]),
                            const SizedBox(height: 8),
                            Text(descripcion, maxLines: 2, overflow: TextOverflow.ellipsis,
                              style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('\$${precio.toStringAsFixed(2)}',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.indigo)),
                                agotado
                                    ? const Text('Agotado', style: TextStyle(color: Colors.red, fontSize: 12))
                                    : Text('$stock disponibles', style: TextStyle(color: Colors.green.shade600, fontSize: 12)),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: agotado ? null : () => setState(() => _cart[id] = cantidad + 1),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.indigo,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  icon: const Icon(Icons.add_shopping_cart, size: 18),
                                  label: const Text('Agregar'),
                                ),
                              ),
                              if (cantidad > 0) ...[
                                const SizedBox(width: 8),
                                IconButton(
                                  onPressed: () => setState(() {
                                    if (_cart[id]! <= 1) _cart.remove(id); else _cart[id] = _cart[id]! - 1;
                                  }),
                                  icon: const Icon(Icons.remove_circle_outline),
                                  color: Colors.grey,
                                ),
                                Text('$cantidad', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                IconButton(
                                  onPressed: () => setState(() => _cart[id] = _cart[id]! + 1),
                                  icon: const Icon(Icons.add_circle_outline),
                                  color: Colors.indigo,
                                ),
                              ],
                            ]),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildMisCompras() {
    if (_ventas.isEmpty) {
      return const Center(child: Text('No has realizado compras aún'));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: _ventas.length,
      itemBuilder: (context, index) {
        final v = _ventas[index];
        final total = double.tryParse(v['total_venta'].toString()) ?? 0;
        return Card(
          elevation: 0,
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.shade200),
          ),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: v['estado'] == 'Completado' ? Colors.green.shade50 : Colors.amber.shade50,
              child: Icon(
                v['estado'] == 'Completado' ? Icons.check_circle : Icons.pending,
                color: v['estado'] == 'Completado' ? Colors.green : Colors.amber,
              ),
            ),
            title: Text('Venta #${v['id']}', style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text(v['fecha_venta']?.toString() ?? ''),
            trailing: Text('\$${total.toStringAsFixed(2)}',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo)),
          ),
        );
      },
    );
  }
}