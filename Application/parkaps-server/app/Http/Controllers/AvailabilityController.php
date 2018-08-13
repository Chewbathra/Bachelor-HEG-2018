<?php
/**
 * Created by PhpStorm.
 * User: loics
 * Date: 08.08.2018
 * Time: 11:18
 */

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Availability;
use Illuminate\Support\Facades\DB;

class AvailabilityController
{
    private $messages = [
        'start.required' => "Une date de début est requise",
        'start.numeric' => 'La date de début doit être un entier au format timestamp',
        'end.required' => "Une date de fin est requise",
        'end.numeric' => 'La date de fin doit être un entier au format timestamp',
        'daily.boolean' => "Le paramètre \"jounalié\" doit être un booléen",
        'carParkId.required' => "Un identifiant d'une place de parking est requise",
        'carParkId.numeric' => "L'identifiant de la place de parking doit être un entier positif",
    ];



    public function search(Request $request)
    {
        $request->validate([
            'carParkId' => 'required|numeric',
        ], $this->messages);

        $availabilites = DB::table('availabilities')->get()->where('car_park_id', $request->carParkId);

        return response()->json([
            'availabilites' => $availabilites,
        ], 201);

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
           'start' => 'required|numeric',
           'end' => 'required|numeric',
           'daily' => 'boolean',
           'carParkId' => 'required|numeric'
       ], $this->messages);

       $availability = new Availability([
           'start' => Carbon::createFromTimestampMs($request->start),
           'end' =>  Carbon::createFromTimestampMs($request->end),
           'daily' => $request->daily,
           'car_park_id' => $request->carParkId
       ]);
       $availability->save();

        return response()->json([
            'created' => $availability,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Availability $availability
     * @return void
     */
    public function show(Availability $availability)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Availability $availability
     * @return void
     */
    public function update(Request $request, Availability $availability)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Availability $availability
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric'
        ]);
        $availability = Availability::find($request->id);
        $availability->delete();

        return response()->json([
            'deleted' => $availability,
        ], 201);
    }
}