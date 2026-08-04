import 'package:flutter_test/flutter_test.dart';
import 'package:electronic_mobile/main.dart';

void main() {
  testWidgets('App carga correctamente', (WidgetTester tester) async {
    await tester.pumpWidget(const ElectronicApp());
    expect(find.text('Electronic'), findsOneWidget);
  });
}