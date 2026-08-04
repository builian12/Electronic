import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // IP del servidor Fedora en red local (switch): 192.168.1.10
  // Si estás en la misma máquina, cambia por: 127.0.0.1
  static const String baseUrl = 'http://192.168.1.10:8000/api';
  static const Duration _timeout = Duration(seconds: 10);

  /// Resultado del login con información detallada del error.
  static Future<LoginResult> login(String username, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/token/'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'username': username, 'password': password}),
          )
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['access'] as String?;
        if (token != null) {
          return LoginResult.success(token);
        }
        return LoginResult.error('Respuesta inesperada del servidor');
      } else if (response.statusCode == 401) {
        return LoginResult.error('Credenciales incorrectas');
      } else {
        return LoginResult.error('Error del servidor (HTTP ${response.statusCode})');
      }
    } on http.ClientException {
      return LoginResult.error(
        'No se pudo conectar al servidor. Verifica que estés en la misma red y que el backend esté corriendo.',
      );
    } catch (e) {
      return LoginResult.error(
        'Error de conexión: $e. Verifica que el celular y el servidor estén en la misma red.',
      );
    }

  }

  static Future<List<dynamic>> fetchProductos(String token) async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/productos/'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(_timeout);
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
      final response = await http
          .get(
            Uri.parse('$baseUrl/categorias/'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(_timeout);
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
      final response = await http
          .get(
            Uri.parse('$baseUrl/ventas/'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(_timeout);
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
      final response = await http
          .post(
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
          )
          .timeout(_timeout);
      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  static Future<List<dynamic>> fetchProveedores(String token) async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/proveedores/'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(_timeout);
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}

/// Resultado del login con estado y mensaje de error.
class LoginResult {
  final bool success;
  final String? token;
  final String? error;

  LoginResult._(this.success, this.token, this.error);

  factory LoginResult.success(String token) =>
      LoginResult._(true, token, null);

  factory LoginResult.error(String message) =>
      LoginResult._(false, null, message);
}
