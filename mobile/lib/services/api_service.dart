import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // IP del servidor Fedora en red local (switch): 192.168.1.10
  // Si estás en la misma máquina, cambia por: 127.0.0.1
  static const String baseUrl = 'http://192.168.1.10:8000/api';

  static Future<String?> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/token/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': username, 'password': password}),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['access'] as String?;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static Future<List<dynamic>> fetchProductos(String token) async {
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