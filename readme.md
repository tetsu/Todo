## About Todo

Todo is a web application to manage TODO tasks. Currently availabl only in Japanese.


## How to Set Up
1. Set up git, and copy code from Github by using following git command from directory where you want to install this program.
```
git clone git@github.com:tetsu/Todo.git
```
1. Go to newly created "Todo" directory, and edit .env file for your database.
```
cd Todo
cp .env.example .env
vim .env
```
1. Install Laravel libraries. You need to set up [composer](https://getcomposer.org/) before using this command.
```
composer install
```
1. Set security key by following command.
```
php artisan key:generate
```
1. Initialize database using Laravel migration
```
php artisan migrate:refresh --seed
```
1. Set up your web server and run. It'll be easier to start by using [Laravel Homestead](https://laravel.com/docs/5.4/homestead).

## License

The Todo web application is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
