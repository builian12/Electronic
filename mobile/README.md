# Mobile app Electronic

Esta carpeta contiene la aplicación Flutter móvil del sistema Electronic.

## Configuración previa

Asegúrate de tener instalado Flutter y el SDK correctamente:

```bash
cd /home/williamllano/Descargas/Electronic/mobile
../flutter/bin/flutter pub get
```

## Ejecutar la app

Conecta un dispositivo o inicia un emulador y luego:

```bash
cd /home/williamllano/Descargas/Electronic/mobile
../flutter/bin/flutter run
```

## Servidor backend para móviles

La app móvil consume el backend en:

- `http://192.168.1.10:8000/api/token/` para login
- `http://192.168.1.10:8000/api/productos/`, `.../categorias/`, `.../ventas/`, `.../proveedores/`

### Requisitos de red

1. El servidor Fedora debe ejecutar Django con:

```bash
cd /home/williamllano/Descargas/Electronic/backend
./runserver.sh
```

2. Todos los dispositivos móviles y emuladores deben estar en la misma red local (`192.168.1.x`).

3. Si usas emulador Android, asegúrate de que pueda acceder a la LAN local.

## Credenciales

- Admin: `admin` / `Admin123!`
- Cliente: `cliente` / `Cliente123!`
