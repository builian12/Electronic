#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 no está disponible en PATH. Instala Python 3." >&2
  exit 1
fi

echo "Ejecutando migraciones de Django..."
python3 manage.py migrate

echo "Poblando datos iniciales..."
python3 populate.py

echo "Listo: base de datos inicializada y datos de ejemplo cargados."
