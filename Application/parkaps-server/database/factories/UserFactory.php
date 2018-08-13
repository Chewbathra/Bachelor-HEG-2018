<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\User::class, function (Faker $faker) {
    return [
        'name' => 'Loïc',
        'email' => 'loicschup@gmail.com',
        'password' => '$2y$10$nVcX06xfp256dJj3nLznFu8Q.DfY6RxpcYw.ow0Q4YbDHm5JZ.OmW', // 123
        'balance' => $faker->randomFloat(2,1,1000),
        'active' => 1,
        'activation_token' => ''
    ];
});
