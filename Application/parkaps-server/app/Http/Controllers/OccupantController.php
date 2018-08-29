<?php

namespace App\Http\Controllers;

use App\Occupant;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OccupantController extends Controller
{
    public function create(Request $request){
        $request->validate([
            'start' => 'required|numeric',
            'end' => 'required|numeric',
            'carParkId' => 'required|numeric'
        ]);

        $occupant = new Occupant([
            'start' => Carbon::createFromTimestampMs($request->start),
            'end' => Carbon::createFromTimestampMs($request->end),
            'car_park_id' => $request->carParkId,
            'user_id' => $request->user()->id
        ]);
        $occupant->save();

        return response('Created', 201);
    }

    public function get(Request $request){
        $id = $request->route('id');

        $occupants = Occupant::where('car_park_id', $id)->get();
        foreach ($occupants as $occupant){
            $occupant->start = Carbon::parse($occupant->start)->toW3cString();
            $occupant->end = Carbon::parse($occupant->end)->toW3cString();
        }

        return response()->json([
            'occupants' => $occupants
        ],200);
    }


    public function delete(Request $request){
        $id = $request->route('id');

        $occupant = Occupant::find($id);

        if($occupant->user_id != $request->user()->id){
            return response('Forbidden', 403);
        }

        $occupant->delete();

        return response('Deleted', 201);
    }
}
