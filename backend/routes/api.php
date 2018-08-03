<?php

use Illuminate\Http\Request;
use App\User;
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

Route::get("/login/token/{token}/{email}","LoginController@loginToken");
Route::post("/login","LoginController@login");
Route::post("/register","RegisterController@register");
Route::post("/user/update-projects/{email}/{token}",function($email,$token,Request $request){
	$user=User::where("email",$email)->first();
	$user->projects=$request->projects;
	$user->save();
	return json_encode(array("ok"=>1,"reason"=>"Projects updated success!"));
})->middleware("logged_token");
