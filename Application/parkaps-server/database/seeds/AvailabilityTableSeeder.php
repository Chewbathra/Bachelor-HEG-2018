<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AvailabilityTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Availability::class,20)->create();
        $availability = new \App\Availability([
            'start' => Carbon::now()->toDateTimeString(),
            'end' => Carbon::now()->addDay(1)->toDateTimeString(),
            'car_park_id' => 1
        ]);
        $availability->save();
    }
}
