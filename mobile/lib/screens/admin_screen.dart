import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/session_service.dart';

class AdminScreen extends StatefulWidget {
  final String token;
  final String username;
  const AdminScreen({super.key, required this.token, required this.username});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  List<dynamic> _productos = [];
  List<dynamic> _ventas = [];
  List<dynamic> _categorias = [];
  List<dynamic> _proveedores = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final productos = await ApiService.fetchProductos(widget.token);
    final ventas = await ApiService.fetchVentas(widget.token);
    final categorias = await ApiService.fetchCategorias(widget.token);
    final proveedores = await ApiService.fetchProveedores(widget.token);
    setState(() {
      _productos = productos;
      _ventas = ventas;
      _categorias = categorias;
      _proveedores = proveedores;
      _loading = false;
    });
  }

  Future<void> _logout() async {
    await SessionService.clearSession();
    if (mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    }
  }

  double get _totalVentas {
    return _ventas.fold(0.0, (sum, v) => sum + (double.tryParse(v['total_venta'].toString()) ?? 0));
  }

  String _getCategoriaNombre(dynamic cat) {
    if (cat is Map) return cat['nombre']?.toString() ?? '';
    return '';
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: Colors.grey.shade50,
        appBar: AppBar(
          backgroundColor: Colors.indigo,
          foregroundColor: Colors.white,
          title: const Row(children: [
            Icon(Icons.bolt),
            SizedBox(width: 8),
            Text('Panel Admin'),
          ]),
          actions: [
            IconButton(
              onPressed: _logout,
              icon: const Icon(Icons.logout),
              tooltip: 'Cerrar sesión',
            ),
          ],
          bottom: const TabBar(tabs: [
            Tab(icon: Icon(Icons.dashboard), text: 'Dashboard'),
            Tab(icon: Icon(Icons.inventory_2), text: 'Productos'),
            Tab(icon: Icon(Icons.receipt_long), text: 'Ventas'),
          ]),
        ),
        body: _loading
            ? const Center(child: CircularProgressIndicator(color: Colors.indigo))
            : TabBarView(children: [
                _buildDashboard(),
                _buildProductos(),
                _buildVentas(),
              ]),
      ),
    );
  }

  Widget _buildDashboard() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Colors.indigo, Colors.blue]),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Panel ejecutivo',
                style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              const Text('Gestión de inventario y ventas',
                style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('Operación estable · ${_productos.length} productos disponibles',
                style: TextStyle(color: Colors.white.withOpacity(0.8))),
            ],
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          children: [
            _statCard('Ventas', '\$${_totalVentas.toStringAsFixed(2)}', Icons.money, Colors.green),
            _statCard('Productos', '${_productos.length}', Icons.inventory_2, Colors.indigo),
            _statCard('Proveedores', '${_proveedores.length}', Icons.local_shipping, Colors.amber),
            _statCard('Categorías', '${_categorias.length}', Icons.category, Colors.purple),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Ventas recientes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              if (_ventas.isEmpty)
                const Center(child: Text('No hay ventas', style: TextStyle(color: Colors.grey)))
              else
                ..._ventas.take(5).map((v) {
                  final total = double.tryParse(v['total_venta'].toString()) ?? 0;
                  final usuario = v['usuario'] is Map ? v['usuario']['username'].toString() : '—';
                  return ListTile(
                    dense: true,
                    leading: Icon(
                      v['estado'] == 'Completado' ? Icons.check_circle : Icons.pending,
                      color: v['estado'] == 'Completado' ? Colors.green : Colors.amber,
                    ),
                    title: Text('Venta #${v['id']} - \$${total.toStringAsFixed(2)}'),
                    subtitle: Text('Cliente: $usuario'),
                  );
                }),
            ],
          ),
        ),
      ],
    );
  }

  Widget _statCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color),
          ),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
          Text(title, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildProductos() {
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: _productos.length,
        itemBuilder: (context, index) {
          final p = _productos[index];
          final nombre = p['nombre']?.toString() ?? '';
          final descripcion = p['descripcion']?.toString() ?? '';
          final precio = double.tryParse(p['precio_unitario'].toString()) ?? 0;
          final stock = p['stock_disponible'] ?? 0;
          final categoria = _getCategoriaNombre(p['categoria']);
          return Card(
            elevation: 0,
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.grey.shade200),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 48, height: 48,
                    decoration: BoxDecoration(color: Colors.indigo.shade50, borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.memory, color: Colors.indigo),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(nombre, style: const TextStyle(fontWeight: FontWeight.w600)),
                        if (categoria.isNotEmpty) Text(categoria, style: TextStyle(fontSize: 12, color: Colors.indigo.shade600)),
                        Text(descripcion, maxLines: 1, overflow: TextOverflow.ellipsis,
                          style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                        const SizedBox(height: 4),
                        Row(children: [
                          Text('\$${precio.toStringAsFixed(2)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo)),
                          const Spacer(),
                          Text('Stock: $stock',
                            style: TextStyle(
                              color: stock > 0 ? Colors.green.shade600 : Colors.red,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            )),
                        ]),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildVentas() {
    return RefreshIndicator(
      onRefresh: _load,
      child: _ventas.isEmpty
          ? ListView(children: const [
              SizedBox(height: 200),
              Center(child: Text('No hay ventas registradas')),
            ])
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _ventas.length,
              itemBuilder: (context, index) {
                final v = _ventas[index];
                final total = double.tryParse(v['total_venta'].toString()) ?? 0;
                final usuario = v['usuario'] is Map ? v['usuario']['username'].toString() : '—';
                return Card(
                  elevation: 0,
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: Colors.grey.shade200),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: v['estado'] == 'Completado' ? Colors.green.shade50 : Colors.amber.shade50,
                          child: Icon(
                            v['estado'] == 'Completado' ? Icons.check_circle : Icons.pending,
                            color: v['estado'] == 'Completado' ? Colors.green : Colors.amber,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Venta #${v['id']}', style: const TextStyle(fontWeight: FontWeight.w600)),
                              Text('Cliente: $usuario', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                              Text(v['fecha_venta']?.toString() ?? '', style: TextStyle(color: Colors.grey.shade400, fontSize: 11)),
                            ],
                          ),
                        ),
                        Text('\$${total.toStringAsFixed(2)}',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo)),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}