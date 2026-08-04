import 'package:flutter/material.dart';
import 'cliente_screen.dart';
import 'admin_screen.dart';

class HomeScreen extends StatelessWidget {
  final String token;
  final String username;
  final bool isAdmin;

  const HomeScreen({
    super.key,
    required this.token,
    required this.username,
    required this.isAdmin,
  });

  @override
  Widget build(BuildContext context) {
    if (isAdmin) {
      return AdminScreen(token: token, username: username);
    }
    return ClienteScreen(token: token, username: username);
  }
}