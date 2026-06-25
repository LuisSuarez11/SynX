<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tenant_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 1. Crear el Tenant (Gimnasio)
        $tenant = \App\Models\Tenant::create([
            'name' => $request->tenant_name,
            'slug' => Str::slug($request->tenant_name) . '-' . Str::random(4),
            'plan' => 'freemium' // Plan por defecto para nuevos
        ]);

        // 2. Crear el Dueño (Owner)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'owner', // Solo dueños se registran por web
            'qr_token' => Str::random(12),
            'tenant_id' => $tenant->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'tenant' => $tenant
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string', // Puede ser Email o CI
            'password' => 'required|string',
        ]);

        // Verificar si ingresó un Email o un CI
        $fieldType = filter_var($request->login_id, FILTER_VALIDATE_EMAIL) ? 'email' : 'ci_number';

        $user = User::where($fieldType, $request->login_id)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user->load('tenant.branches');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
