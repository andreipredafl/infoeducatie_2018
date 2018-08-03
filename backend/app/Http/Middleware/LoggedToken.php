<?php

namespace App\Http\Middleware;

use Closure;
use App\User;
use App\Token;
class LoggedToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
		$user = User::where("email", "=", $request->route('email'))->first();
		if (Token::where("user_id","=",$user->id)->where("token","=",$request->route('token'))->count()==1) {
			return $next($request);

		}else{
			return response(json_encode(array("ok" => 0, "reason" => "Wrong username or password")));
		}

    }
}
