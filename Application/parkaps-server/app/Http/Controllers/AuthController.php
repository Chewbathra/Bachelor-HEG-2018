<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Validator;
use App\User;
use App\Notifications\RegisterActivate;


class AuthController extends Controller
{

    private $messages = [
        'name.required' => 'Un nom est requis',
        'name.string'  => 'Le nom n\'es pas valide',
        'email.required' => 'Un email est requis',
        'email.string' => 'L\'email n\'est pas valide',
        'email.email' => 'L\'email n\'est pas valide',
        'email.unique' => 'Cet email est déjà utilisé',
        'password.required' => 'Un mot de passe est requis',
        'password.string' => 'Le mot de passe n\'est pas valide',
        'password.confirmed' => 'Les mot de passes ne coïncide pas'
    ];


    /**
     * Create user
     *
     * @param  [string] name
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @return [\Illuminate\Http\Response] message
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed'
        ],$this->messages);

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'activation_token' => str_random(60)
        ]);

        $user->save();
        $user->notify(new RegisterActivate($user));

        return response(201);

//        return response()->json([
//            'user' => $user
//        ], 201);
    }

    /**
     * Set account validated
     * @param $token [string] activation token
     * @return \Illuminate\Http\JsonResponse
     */
    public function registerActivate($token)
    {
        $user = User::where('activation_token', $token)->first();

        if (!$user) {
            return response()->json([
                'message' => 'This activation token is invalid.'
            ], 404);
        }

        $user->active = true;
        $user->activation_token = '';
        $user->save();

        return view('active');
    }

    /**
     * Login user and create token
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [boolean] remember_me
     * @return [string] access_token
     * @return [string] token_type
     * @return [string] expires_at
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ], $this->messages);

        $credentials = request(['email', 'password']);
        $credentials['active'] = 1;
        $credentials['deleted_at'] = null;

        if(!Auth::attempt($credentials))
            return response()->json([
                'errors' => [
                    "active" => "Le mot de passe n'est pas valide ou vous n'avez pas activé votre compte"
                ]
            ], 401);

        $user = $request->user();

        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;
        if ($request->remember_me){
            $token->expires_at = Carbon::now()->addWeeks(1);
        }
        $token->save();

        return response()->json([
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
//                $tokenResult->token->expires_at
                $token->expires_at
            )->toDateTimeString()
        ],200);
    }

    /**
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response(200);
    }

    /**
     * Get the authenticated User
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse [json] user object
     */
    public function user(Request $request)
    {
        $carParks = DB::select("SELECT * FROM car_parks WHERE user_id =" . $request->user()->id . ";");
        return response()->json([
            'user' => $request->user(),
            'carParks' => $carParks
        ]);
    }
}