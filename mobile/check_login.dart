import 'package:electronic_mobile/services/api_service.dart';

Future<void> main() async {
  final token = await ApiService.login('admin', 'Admin123!');
  print('admin token: $token');
  final token2 = await ApiService.login('cliente', 'Cliente123!');
  print('cliente token: $token2');
}
