<?php

use Illuminate\Database\Seeder;

class CarParksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\CarPark::class, 100)->create()->each(function ($park){
//            $params = [
//                'index' => 'parkaps',
//                'type' => 'car_parks' ,
//                'id' => $park->id,
//                'body' => [
//                    'location' => [
//                        'lat' => floatval($park->latitude),
//                        'lon' => floatval($park->longitude)
//                    ]
//                ]
//            ];
//            \Elasticsearch::index($params);
        });
    }
}
