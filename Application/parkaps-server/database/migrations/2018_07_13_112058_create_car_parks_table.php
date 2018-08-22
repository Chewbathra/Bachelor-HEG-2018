<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarParksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('car_parks', function (Blueprint $table) {
            $table->increments('id');
            $table->string('latitude')->nullable(false);
            $table->string('longitude')->nullable(false);
            $table->longText('picture');
            $table->string('address')->nullable(false);
            $table->decimal('price',10,2)->nullable(false);
            $table->string('description')->nullable(true)->default("");
            $table->unsignedInteger('user_id')->nullable(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        //NOT USED NOW
//        $params = [
//            'index' => 'parkaps',
//            'body' => [
//                'mappings' => [
//                    'car_parks' => [
//                        "properties" => [
//                            "location" => [
//                                "type" => "geo_point"
//                            ]
//                        ]
//                    ]
//                ]
//            ]
//        ];
//
//        \Elasticsearch::indices()->create($params);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('car_parks');
        //NOT USED NOW
//        $params = ['index' => 'parkaps'];
//        \Elasticsearch::indices()->delete($params);
    }
}
