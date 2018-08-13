<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarPark extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'latitude', 'longitude', 'address', 'picture', 'price', 'user_id',
    ];
}
