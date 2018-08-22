<?php

use Faker\Generator as Faker;
use Carbon\Carbon;

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

$factory->define(App\Availability::class, function (Faker $faker) {
    return [
        'start' => Carbon::now()->toDateTimeString(),
        'end' => Carbon::now()->addDay($faker->numberBetween(1,6))->addHours($faker->numberBetween(1,10))->toDateTimeString(),
        'car_park_id' => $faker->numberBetween(1,100)
    ];
});
