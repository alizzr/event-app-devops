FROM php:8.2-apache

# Extension MySQL
RUN docker-php-ext-install pdo_mysql
RUN a2enmod rewrite

WORKDIR /var/www/html

# Copie des fichiers
COPY . .

# Configuration Apache
COPY vhost.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80