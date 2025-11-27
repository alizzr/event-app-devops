FROM php:8.2-apache

# 1. Installation dépendances
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl

# 2. Extensions PHP
RUN docker-php-ext-install pdo_mysql zip

# 3. Activation mod_rewrite (CRUCIAL)
RUN a2enmod rewrite

# 4. Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 5. Copie du code
COPY . .

# 6. Installation dépendances Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev
RUN chown -R www-data:www-data storage bootstrap/cache

# 7. --- CONFIGURATION APACHE FORCÉE ---
# On supprime la config par défaut et on met la nôtre
COPY vhost.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80