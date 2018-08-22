<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Carbon\Carbon;

class CreateDailyAvailabilitiesTable extends Migration
{
    private $time;

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->time =  Carbon::now()->toDateTimeString();
        Schema::create('daily_availabilities', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('start')->nullable(false)->default($this->time);
            $table->timestamp('end')->nullable(false)->default($this->time);
            $table->unsignedInteger('car_park_id')->nullable(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('car_park_id')->references('id')->on('car_parks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('daily_availabilities');
    }
}
