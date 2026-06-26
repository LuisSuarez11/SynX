#!/usr/bin/env bash
# script para compilar en Render.com

# Detener ejecución si hay errores
set -e

# Instalar dependencias de composer
composer install --no-interaction --prefer-dist --optimize-autoloader

# Limpiar cachés y configurar
php artisan clear-compiled
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Correr migraciones en producción (forzado porque estamos en entorno prod)
php artisan migrate --force

# El servidor de Render se iniciará según la configuración de la interfaz web
