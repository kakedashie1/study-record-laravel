FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    git \
    unzip \
    zip \
    curl \
    libpq-dev \
    libzip-dev \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

COPY docker/nginx/default.conf /etc/nginx/sites-available/default
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD php artisan migrate --force && php-fpm -D && nginx -g "daemon off;"
