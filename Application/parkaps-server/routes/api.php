<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::post('login', 'AuthController@login');
Route::post('register', 'AuthController@register');
Route::get('activate/{token}', 'AuthController@registerActivate');

Route::group([
    'middleware' => 'auth:api'
], function () {
    Route::get('logout', 'AuthController@logout');
    Route::get('user', 'AuthController@user');

    Route::group([
        'prefix' => 'park',
    ], function () {
        Route::post('create', 'CarParkController@create');
        Route::post('search', "CarParkController@search");
    });

    Route::group([
        'prefix' => 'availability',
    ], function () {
        Route::post('create', 'AvailabilityController@create');
        Route::post('search', "AvailabilityController@search");
        Route::post('destroy', "AvailabilityController@destroy");
    });
});