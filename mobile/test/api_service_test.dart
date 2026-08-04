import 'package:flutter_test/flutter_test.dart';
import 'package:electronic_mobile/services/api_service.dart';

void main() {
  test('login candidates include common local backend addresses', () {
    final candidates = ApiService.buildLoginCandidates();

    expect(candidates, contains('http://10.0.2.2:8000/api'));
    expect(candidates, contains('http://192.168.1.10:8000/api'));
    expect(candidates, contains('http://192.168.0.104:8000/api'));
  });
}
