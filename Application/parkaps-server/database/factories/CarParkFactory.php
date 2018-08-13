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

$factory->define(App\CarPark::class, function (Faker $faker) {
    return [

        'latitude' => $faker->randomFloat(6,46.163473,46.251514),
        'longitude' => $faker->randomFloat(6,6.075183,6.250108),
        'address' => $faker->address,
        'picture' => $faker->imageUrl(200,200, null,true),
        'price' => $faker->randomFloat(2,1,1000),
        'user_id' => 1
    ];
});
