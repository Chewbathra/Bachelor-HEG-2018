<?php

namespace App\Http\Controllers;

use App\Availability;
use App\CarPark;
use App\DailyAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CarParkController extends Controller
{
    private $messages = [
        'latitude.required' => "Une latitude est requise",
        'latitude.numeric' => 'La latitude doit être un nombre réel',
        'latitude.valide' => "Le format de la latitude n'est pas correct",
        'longitude.required' => "Une longitude est requise",
        'longitude.numeric' => 'La longitude doit être un nombre réel',
        'longitude.valide' => "Le format de la longitude n'est pas correct",
        'picture.string' => "L'image doit être une chaine de caractères",
        'price.required' => "Un prix est requis",
        'price.numeric' => "Le prix doit être un numérique",
        'address.required' => "Une adresse est requise",
        'address.string' => "L'adresse doit être une chaine de caractère",
        'description.string' => "La description doit être une chaine de caractères",
        'description.max' => "La description ne doit pas dépasser 190 caractères"
    ];



    public function search(Request $request){
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
        ], $this->messages);

        $radius = $request->radius;

        $carParks = DB::select("SELECT *,(((acos(sin((".$request->latitude."*pi()/180)) * 
            sin((`Latitude`*pi()/180))+cos((".$request->latitude."*pi()/180)) * 
            cos((`Latitude`*pi()/180)) * cos(((".$request->longitude."- `Longitude`)* 
            pi()/180))))*180/pi())*(60*1.1515*1609.344)
        ) as distance 
        FROM `car_parks`
        WHERE deleted_at IS NULL
        HAVING distance <= ".$radius.";"
        );

        return response()->json([
            'results' => $carParks
        ],200);
    }

    /**
     * Validates a given latitude $lat
     *
     * @param float|int|string $lat Latitude
     * @return bool `true` if $lat is valid, `false` if not
     */
    private function validateLatitude($lat) {
        return preg_match('/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/', $lat);
    }

    /**
     * Validates a given longitude $long
     *
     * @param float|int|string $long Longitude
     * @return bool `true` if $long is valid, `false` if not
     */
    private function validateLongitude($long) {
        return preg_match('/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/', $long);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $request->validate([
        'latitude' => 'required|string',
        'longitude' => 'required|string',
        'address' => 'required|string',
        'picture' => 'string',
        'price' => 'required|numeric',
        'description' => 'string|max:190'
        ], $this->messages);

        if($this->validateLatitude($request->latitude) == false){
            return response()->json([
                'message' => "The given data was invalid",
                'errors' => [
                    'latitude' => $this->messages['latitude.valide']
                ]
            ], 422);
        }

        if($this->validateLongitude($request->longitude) == false){
            return response()->json([
                'message' => "The given data was invalid",
                'errors' => [
                    'longitude' => $this->messages['longitude.valide']
                ]
            ], 422);
        }

        $carPark = new CarPark([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address,
            'picture' => $request->picture,
            'price' => $request->price,
            'description' => $request->description,
            'user_id' => $request->user()->id
        ]);
        $carPark->save();

        return response()->json([
            'created' => $carPark,
        ], 201);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param $id
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function modify($id, Request $request)
    {
        $request->validate([
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'address' => 'required|string',
            'picture' => 'string',
            'price' => 'required|numeric',
            'description' => 'string|max:190'
        ], $this->messages);

        if($this->validateLatitude($request->latitude) == false){
            return response()->json([
                'message' => "The given data was invalid",
                'errors' => [
                    'latitude' => $this->messages['latitude.valide']
                ]
            ], 422);
        }

        if($this->validateLongitude($request->longitude) == false){
            return response()->json([
                'message' => "The given data was invalid",
                'errors' => [
                    'longitude' => $this->messages['longitude.valide']
                ]
            ], 422);
        }

        $carPark = CarPark::find($id);

        if($request->user()->id != $carPark->user_id){
            return response('Forbidden', 403);
        }

        $carPark->latitude = $request->latitude;
        $carPark->longitude = $request->longitude;
        $carPark->address = $request->address;
        $carPark->picture = $request->picture;
        $carPark->price = $request->price;
        $carPark->description = $request->description;
        $carPark->save();

        return response('Updated',201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function delete($id, Request $request)
    {
        $carPark = CarPark::find($id);

        if($request->user()->id != $carPark->user_id){
            return response('Forbidden', 403);
        }

        $availabilities = Availability::where('car_park_id', $carPark->id)->get();
        foreach ($availabilities as $availability){
            $availability->delete();
        }
        $dailyAvailabilities = DailyAvailability::where('car_park_id', $carPark->id)->get();
        foreach ($dailyAvailabilities as $dailyAvailability){
            $dailyAvailability->delete();
        }
        $carPark->delete();

        return response('Deleted', 201);
    }
}
