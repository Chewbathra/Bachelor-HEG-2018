<?php

namespace App\Http\Controllers;

use App\CarPark;
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
        'address.string' => "L'adresse doit être une chaine de caractère"
    ];



    public function search(Request $request){
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
        ], $this->messages);

//        if($this->validateLatitude($request->latitude) == false){
//            return response()->json([
//                'message' => "The given data was invalid",
//                'errors' => [
//                    'latitude' => $this->messages['latitude.valide']
//                ]
//            ], 422);
//        }
//
//        if($this->validateLongitude($request->longitude) == false){
//            return response()->json([
//                'message' => "The given data was invalid",
//                'errors' => [
//                    'longitude' => $this->messages['longitude.valide']
//                ]
//            ], 422);
//        }

        $radius = $request->radius;

        //FIRST TRY TO DO GEO LOCATION QUERY WITH ELASTICSEARCH
        //NOT USED NOW
//        $jsonSearch = '{
//            "query": {
//                "bool" : {
//                    "must" : {
//                        "match_all" : {}
//                    },
//                    "filter" : {
//                        "geo_distance" : {
//                            "distance" : "'. $radius .'km",
//                            "location": {
//                              "lat": ' . $request->latitude . ',
//                              "lon": ' . $request->longitude .'
//                            }
//                        }
//                    }
//                }
//            }
//        }';
//        $params = [
//            'index' => 'parkaps',
//            'type' => 'car_parks',
//            'body' => $jsonSearch
//        ];
//        $results = \Elasticsearch::search($params);
//
//        $hits = $results['hits']['hits'];
//        $ids = [];
//        foreach ($hits as $hit){
//            $ids[] = intval($hit["_id"]);
//        }
//
//        $carParks = CarPark::find($ids);

        //CHANGED TO A MYSQL QUERY
        $carParks = DB::select("SELECT *,(((acos(sin((".$request->latitude."*pi()/180)) * 
            sin((`Latitude`*pi()/180))+cos((".$request->latitude."*pi()/180)) * 
            cos((`Latitude`*pi()/180)) * cos(((".$request->longitude."- `Longitude`)* 
            pi()/180))))*180/pi())*(60*1.1515*1609.344)
        ) as distance 
        FROM `car_parks` 
        HAVING distance <= ".$radius.";"
        );


        return response()->json([
            'results' => $carParks
        ]);
    }

    /**
     * Validates a given latitude $lat
     *
     * @param float|int|string $lat Latitude
     * @return bool `true` if $lat is valid, `false` if not
     */
    function validateLatitude($lat) {
        return preg_match('/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/', $lat);
    }

    /**
     * Validates a given longitude $long
     *
     * @param float|int|string $long Longitude
     * @return bool `true` if $long is valid, `false` if not
     */
    function validateLongitude($long) {
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
            'user_id' => $request->user()->id
        ]);
        $carPark->save();

        //INDEX TO ELASTICSEARCH
        //NOT USED NOW
//        $params = [
//            'index' => 'parkaps',
//            'type' => 'car_parks' ,
//            'id' => $carPark->id,
//            'body' => [
//                'location' => [
//                    'lat' => floatval($request->latitude),
//                    'lon' => floatval($request->longitude)
//                ]
//            ]
//        ];
//        \Elasticsearch::index($params);

        return response()->json([
            'created' => $carPark,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return void
     */
    public function show(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\CarPark  $carPark
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CarPark $carPark)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\CarPark  $carPark
     * @return \Illuminate\Http\Response
     */
    public function destroy(CarPark $carPark)
    {
        //NOT USED NOW
//        $params = [
//            'index' => 'parkaps',
//            'type' => 'car_parks' ,
//            'id' => $carPark->id,
//
//        ];
//        \Elasticsearch::delete($params);

        $carPark->delete();

    }
}
