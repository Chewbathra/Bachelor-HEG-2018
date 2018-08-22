<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Carbon\Carbon;

class CreateOccupantsTable extends Migration
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
        Schema::create('occupants', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('start')->nullable(false)->default($this->time);
            $table->timestamp('end')->nullable(false)->default($this->time);
            $table->unsignedInteger('user_id')->nullable(false);
            $table->unsignedInteger('car_park_id')->nullable(false);
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('occupants');
    }
}
