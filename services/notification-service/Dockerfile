# Image de base PHP avec Apache
FROM php:8.2-apache

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl

# Activation des extensions PHP requises (MySQL, Sodium pour JWT)
RUN docker-php-ext-install pdo_mysql zip

# Activation du module Rewrite d'Apache (pour les routes Laravel)
RUN a2enmod rewrite

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Dossier de travail
WORKDIR /var/www/html

# Copie du code source
COPY . .

# Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Permissions pour Laravel (Stockage et Cache)
RUN chown -R www-data:www-data storage bootstrap/cache

# Configuration du DocumentRoot Apache vers /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf && \
    sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Port exposé
EXPOSE 80