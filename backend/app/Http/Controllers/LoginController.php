<?php

	namespace App\Http\Controllers;

	use App\Token;
	use App\User;
	use Illuminate\Http\Request;

	class LoginController extends Controller
	{
		public function login(Request $request)
		{
			$user = User::where("email", "=", $request->email)->first();
			if($user) {
				if (password_verify($request->password, $user->password)) {
					$token = md5(rand(0, 9999) . time());
					$token_db = new Token();
					$token_db->user_id = $user->id;
					$token_db->token = $token;
					$token_db->save();
					return json_encode(array("ok" => 1, "reason" => "Logged in!", "email" => $request->email, "token" => $token, "projects" => $user->projects));
				} else {
					return json_encode(array("ok" => 0, "reason" => "Wrong username or password"));
				}
			}else{
				return json_encode(array("ok" => 0, "reason" => "Wrong username or password"));
			}
		}

		public function loginToken($token,$email)
		{
			$user = User::where("email", "=", $email)->first();
			if (Token::where("user_id","=",$user->id)->where("token","=",$token)->count()==1) {

				return json_encode(array("ok" => 1, "reason" => "Logged in!", "email" => $email, "token" => $token, "projects" => $user->projects));
			}else{
				return json_encode(array("ok" => 0, "reason" => "Wrong username or password"));
			}
		}
	}
