<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureExecutiveMember
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isExecutive()) {
            abort(403, 'Access denied.');
        }

        return $next($request);
    }
}
