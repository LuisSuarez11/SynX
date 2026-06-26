FROM php:8.2-apache

# Instalar dependencias del sistema (incluyendo libpq-dev para Postgres)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libpq-dev

# Instalar extensiones PHP necesarias para Laravel
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Habilitar mod_rewrite de Apache (necesario para Laravel)
RUN a2enmod rewrite

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Copiar todos los archivos del backend
COPY . /var/www/html/

# Configurar Apache para que apunte a la carpeta 'public' de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instalar dependencias de PHP
RUN composer install --no-interaction --optimize-autoloader

# Dar permisos a las carpetas de Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Puerto que usará Render
EXPOSE 80

# El servidor iniciará con Apache, intentando migrar y seedear sin bloquear el inicio
CMD php artisan migrate --force ; php artisan db:seed --force ; apache2-foreground
