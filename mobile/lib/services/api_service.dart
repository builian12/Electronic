import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Usa rutas locales estándar para que el móvil pueda conectarse al backend local.
  static const List<String> _baseUrls = [
    'http://127.0.0.1:8000/api',
    'http://localhost:8000/api',
    'http://10.0.2.2:8000/api',
    'http://10.0.3.2:8000/api',
  ];
  static String? _resolvedBaseUrl;
  static const Duration _timeout = Duration(seconds: 10);

  /// Resultado del login con información detallada del error.
  static Future<LoginResult> login(String username, String password) async {
    final payload = jsonEncode({'username': username, 'password': password});
    final headers = {'Content-Type': 'application/json'};

    try {
      final response = await _post('/token/', payload, headers: headers);
      if (response.statusCode == 404) {
        final fallbackResponse =
            await _post('/login/', payload, headers: headers);
        return _parseLoginResponse(fallbackResponse, username);
      }
      return _parseLoginResponse(response, username);
    } catch (_) {
      try {
        final response = await _post('/login/', payload, headers: headers);
        return _parseLoginResponse(response, username);
      } catch (error) {
        return LoginResult.error(
          'No se pudo conectar al servidor. Verifica la red local o usa ADB reverse si el dispositivo está por USB.',
        );
      }
    }
  }

  static Future<List<dynamic>> fetchProductos(String token) async {
    try {
      final response = await _get('/productos/', token);
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
      final response = await _get('/categorias/', token);
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
      final response = await _get('/ventas/', token);
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
      final response = await _post(
        '/ventas/',
        jsonEncode({
          'total_venta': total.toStringAsFixed(2),
          'estado': estado,
          'detalles': detalles,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  static Future<List<dynamic>> fetchProveedores(String token) async {
    try {
      final response = await _get('/proveedores/', token);
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<http.Response> _get(String endpoint, String token) async {
    return _request(
      method: 'GET',
      endpoint: endpoint,
      headers: {'Authorization': 'Bearer $token'},
    );
  }

  static Future<http.Response> _post(
    String endpoint,
    String body, {
    Map<String, String>? headers,
  }) async {
    return _request(
      method: 'POST',
      endpoint: endpoint,
      body: body,
      headers: headers,
    );
  }

  static Future<http.Response> _request({
    required String method,
    required String endpoint,
    String? body,
    Map<String, String>? headers,
  }) async {
    headers ??= {};
    if (!headers.containsKey('Content-Type')) {
      headers['Content-Type'] = 'application/json';
    }

    if (_resolvedBaseUrl != null) {
      final url = Uri.parse('$_resolvedBaseUrl$endpoint');
      try {
        final response = await _sendRequest(method, url, headers, body);
        if (response.statusCode != 404) {
          return response;
        }
      } catch (_) {
        _resolvedBaseUrl = null;
      }
    }

    Exception? lastError;
    for (final baseUrl in _baseUrls) {
      final url = Uri.parse('$baseUrl$endpoint');
      try {
        final response = await _sendRequest(method, url, headers, body);
        if (response.statusCode != 404) {
          _resolvedBaseUrl = baseUrl;
          return response;
        }
      } on Exception catch (e) {
        lastError = e;
        continue;
      }
    }

    if (lastError != null) {
      throw lastError;
    }

    throw Exception('No server available');
  }

  static Future<http.Response> _sendRequest(
    String method,
    Uri url,
    Map<String, String> headers,
    String? body,
  ) {
    if (method == 'GET') {
      return http.get(url, headers: headers).timeout(_timeout);
    }
    return http.post(url, headers: headers, body: body).timeout(_timeout);
  }

  static LoginResult _parseLoginResponse(http.Response response, String username) {
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final token = data['access'] as String?;
      if (token != null) {
        final bool isAdmin = (data['is_staff'] as bool?) == true ||
            (data['is_superuser'] as bool?) == true ||
            username.toLowerCase() == 'admin';
        return LoginResult.success(token, isAdmin: isAdmin);
      }
      return LoginResult.error('Respuesta inesperada del servidor');
    }

    try {
      final body = jsonDecode(response.body);
      if (body is Map && body['detail'] != null) {
        return response.statusCode == 401
            ? LoginResult.error(body['detail'].toString())
            : LoginResult.error('Error del servidor: ${body['detail']}');
      }
    } catch (_) {
      // ignore malformed JSON body
    }

    if (response.statusCode == 401) {
      return LoginResult.error('Credenciales incorrectas');
    }

    return LoginResult.error(
        'Error del servidor (HTTP ${response.statusCode})');
  }
}

/// Resultado del login con estado y mensaje de error.
class LoginResult {
  final bool success;
  final String? token;
  final bool isAdmin;
  final String? error;

  LoginResult._(this.success, this.token, this.isAdmin, this.error);

  factory LoginResult.success(String token, {bool isAdmin = false}) =>
      LoginResult._(true, token, isAdmin, null);

  factory LoginResult.error(String message) =>
      LoginResult._(false, null, false, message);
}
