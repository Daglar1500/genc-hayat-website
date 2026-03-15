FROM php:8.2-apache

# mod_rewrite etkinleştir (.htaccess URL routing için)
RUN a2enmod rewrite

# AllowOverride etkinleştir
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# PHP json uzantısı (8.2'de varsayılan gelir, yine de garanti altına alıyoruz)
RUN docker-php-ext-install opcache

# Çalışma dizini
WORKDIR /var/www/html

# API dosyalarını kopyala
COPY ./api /var/www/html/api

# db klasörü için yazma izni ver (JSON dosyaları güncellenecek)
RUN chown -R www-data:www-data /var/www/html/api/db && \
    chmod -R 775 /var/www/html/api/db

EXPOSE 80
