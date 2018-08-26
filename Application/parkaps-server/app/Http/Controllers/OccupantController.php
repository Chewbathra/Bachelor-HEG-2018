<?php

namespace App\Http\Controllers;

use App\Occupant;
use Illuminate\Http\Request;

class OccupantController extends Controller
{
    public function create(Request $request){

    }

    public function get(Request $request){
        $id = $request->route('id');

        $occupants = Occupant::where('car_park_id', $id)->get();

        return response()->json([
            'occupants' => $occupants
        ], 200);
    }

    public function delete(Request $request){
        $id = $request->route('id');

        $occupant = Occupant::find($id);

        if($occupant->id != $request->user()->id){
            return response('Forbidden', 403);
        }

        $occupant->delete();

        return response('Deleted', 201);
    }
}
