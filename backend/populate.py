import os
import django
from datetime import date

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.models import User
from disquera.models import Disquera
from artista.models import Artista
from album.models import Album
from cancion.models import Cancion
from genero.models import Genero

def populate():
    print("Creando Usuarios...")
    for i in range(1, 6):
        User.objects.get_or_create(
            username=f'usuario{i}',
            defaults={
                'email': f'usuario{i}@musica.com',
                'first_name': f'Nombre{i}',
                'last_name': f'Apellido{i}'
            }
        )
        user = User.objects.get(username=f'usuario{i}')
        user.set_password('123456')
        user.save()
        
    print("Creando Generos...")
    generos_nombres = ['Rock', 'Pop', 'Jazz', 'Hip Hop', 'Electrónica']
    for gen in generos_nombres:
        Genero.objects.get_or_create(
            nombre=gen,
            defaults={
                'descripcion': f'Descripción del género {gen}',
                'estado': True
            }
        )
        
    print("Creando Disqueras...")
    for i in range(1, 6):
        Disquera.objects.get_or_create(
            nombre=f'Disquera Records {i}',
            defaults={
                'pais_origen': 'Estados Unidos' if i % 2 == 0 else 'Reino Unido',
                'anio_fundacion': 1990 + i,
                'email_contacto': f'contacto@disquerarecords{i}.com',
                'estado': True
            }
        )
        
    print("Creando Artistas...")
    generos = ['Rock', 'Pop', 'Jazz', 'Hip Hop', 'Electrónica']
    for i in range(1, 6):
        Artista.objects.get_or_create(
            nombre_artistico=f'Artista Mágico {i}',
            defaults={
                'genero_principal': generos[i-1],
                'biografia': f'Biografía increíble del artista mágico número {i}.',
                'anio_inicio': 2005 + i,
                'estado': True
            }
        )

    print("Creando Álbumes...")
    for i in range(1, 6):
        disquera = Disquera.objects.get(nombre=f'Disquera Records {i}')
        Album.objects.get_or_create(
            titulo=f'Álbum Épico Vol. {i}',
            defaults={
                'fecha_lanzamiento': date(2020 + i, 1, i * 2),
                'portada_url': f'https://via.placeholder.com/300/1DB954/FFFFFF?text=Album+{i}',
                'disquera': disquera,
                'estado': True
            }
        )

    print("Creando Canciones...")
    for i in range(1, 6):
        album = Album.objects.get(titulo=f'Álbum Épico Vol. {i}')
        artista = Artista.objects.get(nombre_artistico=f'Artista Mágico {i}')
        Cancion.objects.get_or_create(
            titulo=f'Canción Número {i}',
            defaults={
                'duracion_segundos': 180 + (i * 15),
                'precio': 1.99,
                'album': album,
                'artista': artista,
                'estado': True
            }
        )
        
    print("¡Base de datos POBLADA CON TEMÁTICA MUSICAL exitosamente!")

if __name__ == '__main__':
    populate()
