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
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          filled: true,
          fillColor: Colors.grey.shade50,
        ),
      ),
      initialRoute: '/login',
      routes: {
        '/login': (_) => const LoginScreen(),
      },
    );
  }
}

