FROM php:8.2-apache

# 1. Dépendances
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl libicu-dev

# 2. Extensions PHP
RUN docker-php-ext-install pdo_mysql zip intl opcache
RUN a2enmod rewrite

# 3. Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 4. Copie du code
COPY . .

# 5. Création dossier Uploads
RUN mkdir -p public/uploads

# 6. Installation
RUN composer install --no-interaction --optimize-autoloader --no-dev
RUN chown -R www-data:www-data var public/uploads

# 7. --- CONFIG APACHE FORCÉE ---
COPY vhost.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80