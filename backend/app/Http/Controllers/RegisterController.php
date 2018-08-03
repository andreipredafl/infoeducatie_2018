<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    function register(Request $request){
    	if(User::where("email","=",$request->email)->count()>0){
    		return json_encode(array("ok"=>0,"reason"=>"User exists already!"));
		}else{
    		$user=new User();
    		$user->email=$request->email;
    		$user->password=password_hash($request->password,PASSWORD_BCRYPT);
    		$user->projects="[]";
    		$user->name="";
    		$user->save();
			return json_encode(array("ok"=>1,"reason"=>"Account created success!"));
		}
	}
}
