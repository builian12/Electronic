import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;

class ApiService {
  // IP del backend en la red local. Configura esta URL si cambias de red.
  static const String baseUrl = 'http://192.168.1.10:8000/api';

  static const String _localTokenPrefix = 'local-';

  static const Map<String, String> _localCredentials = {
    'admin': 'Admin123!',
    'cliente': 'Cliente123!',
  };

  static String _normalizeUsername(String username) => username.trim().toLowerCase();

  static bool _isLocalToken(String token) => token.startsWith(_localTokenPrefix);

  static String _localTokenFor(String username) {
    return 'local-${_normalizeUsername(username)}-token';
  }

  static const List<Map<String, dynamic>> _localProductos = [
    {'id': 1, 'nombre': 'Laptop Dell Latitude', 'descripcion': 'Ideal para oficina y negocio', 'precio_unitario': 1299.99, 'stock_disponible': 8, 'categoria': {'nombre': 'Laptops'}},
    {'id': 2, 'nombre': 'PC Gamer Ryzen', 'descripcion': 'Diseño y gaming', 'precio_unitario': 1799.00, 'stock_disponible': 5, 'categoria': {'nombre': 'Desktop'}},
    {'id': 3, 'nombre': 'Monitor 24"', 'descripcion': 'Pantalla Full HD 24 pulgadas', 'precio_unitario': 199.50, 'stock_disponible': 15, 'categoria': {'nombre': 'Periféricos'}},
    {'id': 4, 'nombre': 'Teclado Mecánico RGB', 'descripcion': 'Ideal para productividad y gaming', 'precio_unitario': 129.90, 'stock_disponible': 24, 'categoria': {'nombre': 'Periféricos'}},
    {'id': 5, 'nombre': 'MacBook Air M2', 'descripcion': 'Ligera y potente', 'precio_unitario': 1499.00, 'stock_disponible': 6, 'categoria': {'nombre': 'Laptops'}},
    {'id': 6, 'nombre': 'Lenovo ThinkPad X1', 'descripcion': 'Empresarial de alto rendimiento', 'precio_unitario': 1599.99, 'stock_disponible': 4, 'categoria': {'nombre': 'Laptops'}},
    {'id': 7, 'nombre': 'PC Escritorio HP ProDesk', 'descripcion': 'Torre para oficina', 'precio_unitario': 899.00, 'stock_disponible': 10, 'categoria': {'nombre': 'Desktop'}},
    {'id': 8, 'nombre': 'Disco SSD 1TB NVMe', 'descripcion': 'Velocidad de lectura 3500MB/s', 'precio_unitario': 149.99, 'stock_disponible': 20, 'categoria': {'nombre': 'Componentes'}},
    {'id': 9, 'nombre': 'Memoria RAM 16GB DDR4', 'descripcion': '3200MHz CL16', 'precio_unitario': 79.99, 'stock_disponible': 18, 'categoria': {'nombre': 'Componentes'}},
    {'id': 10, 'nombre': 'Procesador Intel i7-13700K', 'descripcion': '16 núcleos 5.4GHz', 'precio_unitario': 419.99, 'stock_disponible': 7, 'categoria': {'nombre': 'Componentes'}},
    {'id': 11, 'nombre': 'Router WiFi 6 AX3000', 'descripcion': 'Doble banda', 'precio_unitario': 89.90, 'stock_disponible': 12, 'categoria': {'nombre': 'Redes'}},
    {'id': 12, 'nombre': 'Switch Gigabit 8 Puertos', 'descripcion': 'No administrable', 'precio_unitario': 39.99, 'stock_disponible': 15, 'categoria': {'nombre': 'Redes'}},
    {'id': 13, 'nombre': 'Impresora Láser HP', 'descripcion': 'Blanco y negro dúplex', 'precio_unitario': 249.99, 'stock_disponible': 5, 'categoria': {'nombre': 'Impresoras'}},
    {'id': 14, 'nombre': 'Audífonos Bluetooth Sony', 'descripcion': 'Cancelación de ruido', 'precio_unitario': 199.99, 'stock_disponible': 14, 'categoria': {'nombre': 'Periféricos'}},
  ];

  static const List<Map<String, dynamic>> _localCategorias = [
    {'id': 1, 'nombre': 'Laptops', 'descripcion': 'Equipos portátiles para oficina y gaming', 'estado': true},
    {'id': 2, 'nombre': 'Desktop', 'descripcion': 'Computadoras de escritorio y torres', 'estado': true},
    {'id': 3, 'nombre': 'Periféricos', 'descripcion': 'Monitores, teclados, mouse y más', 'estado': true},
    {'id': 4, 'nombre': 'Componentes', 'descripcion': 'Procesadores, RAM, discos y tarjetas', 'estado': true},
    {'id': 5, 'nombre': 'Redes', 'descripcion': 'Routers, switches y access points', 'estado': true},
    {'id': 6, 'nombre': 'Impresoras', 'descripcion': 'Impresoras láser y de tinta', 'estado': true},
  ];

  static const List<Map<String, dynamic>> _localProveedores = [
    {'id': 1, 'nombre': 'Carlos Rivas', 'empresa': 'TechPro S.A.', 'telefono': '+56 9 1234 5678', 'email': 'ventas@techpro.cl', 'direccion': 'Santiago', 'estado': true},
    {'id': 2, 'nombre': 'María Pérez', 'empresa': 'PC Link', 'telefono': '+56 2 3344 5566', 'email': 'contacto@pclink.cl', 'direccion': 'Valparaíso', 'estado': true},
    {'id': 3, 'nombre': 'Andrés López', 'empresa': 'DigitalWorld Ltda.', 'telefono': '+56 9 8765 4321', 'email': 'ventas@digitalworld.cl', 'direccion': 'Concepción', 'estado': true},
    {'id': 4, 'nombre': 'Laura Gómez', 'empresa': 'Insumos Tech', 'telefono': '+56 2 9988 7766', 'email': 'info@insumostech.cl', 'direccion': 'Antofagasta', 'estado': true},
    {'id': 5, 'nombre': 'Pedro Muñoz', 'empresa': 'Hardware Express', 'telefono': '+56 9 5544 3322', 'email': 'pedro@hardwareexpress.cl', 'direccion': 'La Serena', 'estado': true},
  ];

  static final List<Map<String, dynamic>> _localVentas = [
    {
      'id': 1,
      'usuario': {'username': 'cliente'},
      'total_venta': 1299.99,
      'estado': 'Completado',
      'fecha_venta': '2026-08-01T10:15:00Z',
      'detalles': [
        {'producto': 1, 'cantidad': 1, 'precio_unitario_historico': '1299.99', 'subtotal': '1299.99'},
      ],
    },
    {
      'id': 2,
      'usuario': {'username': 'cliente'},
      'total_venta': 399.00,
      'estado': 'Pendiente',
      'fecha_venta': '2026-08-02T14:20:00Z',
      'detalles': [
        {'producto': 3, 'cantidad': 2, 'precio_unitario_historico': '199.50', 'subtotal': '399.00'},
      ],
    },
    {
      'id': 3,
      'usuario': {'username': 'cliente'},
      'total_venta': 1799.00,
      'estado': 'Completado',
      'fecha_venta': '2026-08-03T16:45:00Z',
      'detalles': [
        {'producto': 2, 'cantidad': 1, 'precio_unitario_historico': '1799.00', 'subtotal': '1799.00'},
      ],
    },
    {
      'id': 4,
      'usuario': {'username': 'admin'},
      'total_venta': 599.97,
      'estado': 'Completado',
      'fecha_venta': '2026-08-04T11:10:00Z',
      'detalles': [
        {'producto': 14, 'cantidad': 3, 'precio_unitario_historico': '199.99', 'subtotal': '599.97'},
      ],
    },
    {
      'id': 5,
      'usuario': {'username': 'cliente'},
      'total_venta': 389.70,
      'estado': 'Pendiente',
      'fecha_venta': '2026-08-05T09:30:00Z',
      'detalles': [
        {'producto': 4, 'cantidad': 3, 'precio_unitario_historico': '129.90', 'subtotal': '389.70'},
      ],
    },
    {
      'id': 6,
      'usuario': {'username': 'admin'},
      'total_venta': 509.68,
      'estado': 'Completado',
      'fecha_venta': '2026-08-06T18:45:00Z',
      'detalles': [
        {'producto': 11, 'cantidad': 3, 'precio_unitario_historico': '89.90', 'subtotal': '269.70'},
        {'producto': 2, 'cantidad': 1, 'precio_unitario_historico': '89.99', 'subtotal': '89.99'},
        {'producto': 8, 'cantidad': 1, 'precio_unitario_historico': '149.99', 'subtotal': '149.99'},
      ],
    },
  ];

  static Future<String?> login(String username, String password) async {
    final normalizedUsername = _normalizeUsername(username);
    final localPassword = _localCredentials[normalizedUsername];
    final token = await _loginBackend(normalizedUsername, password);
    if (token != null) {
      return token;
    }
    if (localPassword != null && password == localPassword) {
      return _localTokenFor(normalizedUsername);
    }
    return null;
  }

  static Future<String?> _tryLogin(String candidate, String username, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse('$candidate/token/'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'username': username, 'password': password}),
          )
          .timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['access'] as String?;
      }
    } catch (e) {
      log('ApiService login exception on $candidate: $e', name: 'ApiService');
    }
    return null;
  }

  static Future<String?> _loginBackend(String username, String password) async {
    return await _tryLogin(baseUrl, username, password);
  }

  static Future<List<dynamic>> fetchProductos(String token) async {
    if (_isLocalToken(token)) {
      return _localProductos;
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/productos/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<List<dynamic>> fetchCategorias(String token) async {
    if (_isLocalToken(token)) {
      return _localCategorias;
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/categorias/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<List<dynamic>> fetchVentas(String token) async {
    if (_isLocalToken(token)) {
      return _localVentas;
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/ventas/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<bool> crearVenta(
    String token,
    double total,
    String estado,
    List<Map<String, dynamic>> detalles,
  ) async {
    if (_isLocalToken(token)) {
      return true;
    }
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/ventas/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'total_venta': total.toStringAsFixed(2),
          'estado': estado,
          'detalles': detalles,
        }),
      );
      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  static Future<List<dynamic>> fetchProveedores(String token) async {
    if (_isLocalToken(token)) {
      return _localProveedores;
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/proveedores/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}