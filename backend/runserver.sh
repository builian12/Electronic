#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 no está disponible en PATH. Instala Python 3." >&2
  exit 1
fi

export DB_HOST="${DB_HOST:-127.0.0.1}"
export DB_PORT="${DB_PORT:-5432}"
export RUNSERVER_PORT="${RUNSERVER_PORT:-8000}"
echo "Usando DB_HOST=$DB_HOST DB_PORT=$DB_PORT"
echo "Ejecutando migraciones de Django..."
python3 manage.py migrate --noinput

echo "Creando usuarios y datos iniciales..."
python3 populate.py

echo "Iniciando backend Django en 0.0.0.0:$RUNSERVER_PORT..."
python3 manage.py runserver 0.0.0.0:$RUNSERVER_PORT
