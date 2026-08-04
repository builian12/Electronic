import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ProductsScreen extends StatefulWidget {
  final String token;
  final bool isAdmin;
  const ProductsScreen({super.key, required this.token, required this.isAdmin});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  late Future<List<dynamic>> _productos;
  List<dynamic> _productosData = [];
  final Map<int, int> _cart = {};
  bool _buying = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    _productos = ApiService.fetchProductos(widget.token);
    _productos.then((data) {
      if (mounted) setState(() => _productosData = data);
    });
  }

  void _reload() {
    setState(() {
      _load();
    });
  }

  int get _cartCount => _cart.values.fold(0, (a, b) => a + b);

  double get _cartTotal {
    double total = 0;
    _cart.forEach((id, qty) {
      final p = _productosData.firstWhere(
        (prod) => prod['id'] == id,
        orElse: () => {},
      );
      if (p.isNotEmpty) {
        total += (double.tryParse(p['precio_unitario'].toString()) ?? 0) * qty;
      }
    });
    return total;
  }

  Future<void> _comprar(List<dynamic> productos) async {
    if (_cart.isEmpty) return;
    setState(() => _buying = true);

    double total = 0;
    final detalles = <Map<String, dynamic>>[];

    _cart.forEach((productoId, cantidad) {
      final producto = productos.firstWhere((p) => p['id'] == productoId);
      final precio = double.parse(producto['precio_unitario'].toString());
      total += precio * cantidad;
      detalles.add({
        'producto': productoId,
        'cantidad': cantidad,
        'precio_unitario_historico': precio.toStringAsFixed(2),
        'subtotal': (precio * cantidad).toStringAsFixed(2),
      });
    });

    final success = await ApiService.crearVenta(
      widget.token,
      total,
      'Completado',
      detalles,
    );

    setState(() => _buying = false);

    if (success) {
      setState(() => _cart.clear());
      _reload();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✅ ¡Compra realizada con éxito! Total: \$${total.toStringAsFixed(2)}'),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error al realizar la compra'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.grey.shade50,
        appBar: AppBar(
          backgroundColor: Colors.indigo,
          foregroundColor: Colors.white,
          title: const Row(
            children: [
              Icon(Icons.bolt, size: 20),
              SizedBox(width: 8),
              Text('Electronic'),
            ],
          ),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.store), text: 'Tienda'),
              Tab(icon: Icon(Icons.receipt), text: 'Ventas'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildTienda(),
            _buildVentas(),
          ],
        ),
        floatingActionButton: _cartCount > 0
            ? FloatingActionButton.extended(
                backgroundColor: Colors.green,
                onPressed: _buying
                    ? null
                    : () {
                        // Cargar productos para calcular total
                        _productos.then((productos) => _comprar(productos));
                      },
                icon: _buying
                    ? const CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                    : const Icon(Icons.shopping_cart_checkout),
                label: Text('Comprar (\$${_cartTotal.toStringAsFixed(2)})'),
              )
            : null,
      ),
    );
  }

  Widget _buildTienda() {
    return FutureBuilder<List<dynamic>>(
      future: _productos,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator(color: Colors.indigo));
        }
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        final productos = snapshot.data ?? [];
        if (productos.isEmpty) {
          return const Center(child: Text('No hay productos disponibles'));
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: productos.length,
          itemBuilder: (context, index) {
            final p = productos[index];
            final id = p['id'] as int;
            final nombre = p['nombre'] ?? '';
            final descripcion = p['descripcion'] ?? '';
            final precio = double.tryParse(p['precio_unitario'].toString()) ?? 0;
            final stock = p['stock_disponible'] ?? 0;
            final categoria = p['categoria'] is Map ? p['categoria']['nombre'] : '';
            final cantidad = _cart[id] ?? 0;
            final agotado = stock <= 0;

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
                    Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: Colors.indigo.shade50,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.memory, color: Colors.indigo),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(nombre, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                              if (categoria != null && categoria.isNotEmpty)
                                Text(
                                  categoria,
                                  style: TextStyle(fontSize: 12, color: Colors.indigo.shade600),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      descripcion,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '\$${precio.toStringAsFixed(2)}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.indigo),
                        ),
                        if (agotado)
                          const Text(
                            'Agotado',
                            style: TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.w500),
                          )
                        else
                          Text(
                            '$stock disponibles',
                            style: TextStyle(color: Colors.green.shade600, fontSize: 12),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: agotado
                                ? null
                                : () {
                                    setState(() {
                                      _cart[id] = cantidad + 1;
                                    });
                                  },
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
                            onPressed: () {
                              setState(() {
                                if (_cart[id]! <= 1) {
                                  _cart.remove(id);
                                } else {
                                  _cart[id] = _cart[id]! - 1;
                                }
                              });
                            },
                            icon: const Icon(Icons.remove_circle_outline),
                            color: Colors.grey,
                          ),
                          Text(
                            '$cantidad',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          IconButton(
                            onPressed: () {
                              setState(() {
                                _cart[id] = _cart[id]! + 1;
                              });
                            },
                            icon: const Icon(Icons.add_circle_outline),
                            color: Colors.indigo,
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildVentas() {
    return FutureBuilder<List<dynamic>>(
      future: ApiService.fetchVentas(widget.token),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator(color: Colors.indigo));
        }
        final ventas = snapshot.data ?? [];
        if (ventas.isEmpty) {
          return const Center(child: Text('No hay ventas registradas'));
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: ventas.length,
          itemBuilder: (context, index) {
            final v = ventas[index];
            final usuario = v['usuario'] is Map ? v['usuario']['username'] ?? '' : v['usuario'];
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
                subtitle: Text('Cliente: $usuario\n${v['fecha_venta'] ?? ''}'),
                isThreeLine: true,
                trailing: Text(
                  '\$${total.toStringAsFixed(2)}',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo),
                ),
              ),
            );
          },
        );
      },
    );
  }
}