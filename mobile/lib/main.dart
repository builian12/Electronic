import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const ElectronicApp());
}

class ElectronicApp extends StatelessWidget {
  const ElectronicApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Electronic',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}
