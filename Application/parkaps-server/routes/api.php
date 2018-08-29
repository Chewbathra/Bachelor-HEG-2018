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

Route::post('users','UserController@create');
//This route will change !
Route::get('users/activate/{token}','UserController@activate'); //A mettre en put
Route::post('login', 'UserController@login');

Route::group([
    'middleware' => 'auth:api'
], function() {

   Route::get('logout', 'UserController@logout');
   Route::get('user', 'UserController@get');
   Route::put('user', 'UserController@modify');
   Route::delete('user', 'UserController@delete');
   Route::get('user/occupants', 'UserController@occupants');
   Route::get('user/carparks','UserController@carparks');

   Route::get('/token', 'UserController@testToken');

   Route::group([
       'prefix' => 'carparks'
   ], function() {
      Route::post('/', 'CarParkController@create');
      Route::put('/{id}', 'CarParkController@modify');
      Route::get('/{id}', 'CarParkController@get');
      Route::delete('/{id}', 'CarParkController@delete');
      Route::post('/search', 'CarParkController@search'); //Changer en get

      Route::get('/{id}/availabilities', 'AvailabilityController@get');
      Route::get('/{id}/occupants', 'OccupantController@get');
   });

   Route::group([
       'prefix' => 'availabilities'
   ], function() {
      Route::post('/', 'AvailabilityController@create');
      Route::post('/{id}', 'AvailabilityController@delete'); //A mettre en delete
   });

   Route::group([
       'prefix' => 'occupants'
   ], function() {
      Route::post('/', 'OccupantController@create');
      Route::delete('/{id}', 'OccupantController@delete');
   });
});