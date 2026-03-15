FROM php:8.2-apache

# Mod rewrite aktif et (.htaccess için)
RUN a2enmod rewrite

# Apache config: AllowOverride All
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-enabled/override.conf

# PHP dosyalarını kopyala
COPY . /var/www/html/

# Data klasörü oluştur ve izin ver
RUN mkdir -p /var/www/html/data && chmod 777 /var/www/html/data

EXPOSE 80
