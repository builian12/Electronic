import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection
from django.contrib.auth.models import User
from django.apps import apps

legacy_tables = [
    'album_album',
    'artista_artista',
    'cancion_cancion',
    'disquera_disquera',
    'genero_genero',
]

for table in legacy_tables:
    with connection.cursor() as cursor:
        cursor.execute("SELECT to_regclass(%s)", [table])
        exists = cursor.fetchone()[0]
        if exists:
            cursor.execute(f'DROP TABLE IF EXISTS {table} CASCADE;')
            print(f'Eliminada tabla: {table}')

# Limpiar usuarios heredados y dejar solo los nuevos usuarios relevantes
for user in User.objects.exclude(username__in=['admin', 'cliente']):
    user.delete()
    print(f'Eliminado usuario: {user.username}')

print('Limpieza finalizada. Solo quedan los datos del nuevo sistema.')