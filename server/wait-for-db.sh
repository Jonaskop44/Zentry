#!/bin/sh

host="$1"
shift

echo "Warte auf DB unter $host..."

while ! nc -z "$host" 5432; do
  echo "DB nicht erreichbar, warte..."
  sleep 2
done

echo "DB ist erreichbar, starte Server..."

exec "$@"
