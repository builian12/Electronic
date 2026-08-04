import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
u, created = User.objects.get_or_create(username='alexander')
u.set_password('1234')
u.is_superuser = True
u.is_staff = True
u.save()
print('created' if created else 'updated', u.username)
