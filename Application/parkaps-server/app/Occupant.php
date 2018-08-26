<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Occupant extends Model
{
    use SoftDeletes;

    protected $fillable = ['start', 'end', 'user_id', 'car_park_id'];
}
