<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class MemberPortalController extends Controller
{
    /**
     * Obtener toda la información necesaria para el Dashboard del Miembro
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Validar que realmente sea un miembro
        if ($user->role !== 'member') {
            return response()->json(['error' => 'Acceso denegado'], 403);
        }

        // Cargar las relaciones necesarias
        $user->load([
            'branch',
            'subscriptions' => function ($query) {
                $query->orderBy('created_at', 'desc')->with('membership');
            }
        ]);

        // Determinar el estado actual del miembro
        $activeSubscription = $user->subscriptions->first(function ($sub) {
            if ($sub->status !== 'active') return false;
            if (!$sub->end_date) return true;
            return Carbon::parse($sub->end_date)->endOfDay()->isFuture();
        });

        // Retornar payload estructurado para la app móvil
        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'qr_token' => $user->qr_token,
                'branch' => $user->branch ? $user->branch->name : 'Sin sucursal asignada',
            ],
            'membership' => $activeSubscription ? [
                'name' => $activeSubscription->membership->name,
                'status' => 'active',
                'type' => $activeSubscription->membership->type,
                'end_date' => $activeSubscription->end_date,
                'remaining_credits' => $activeSubscription->remaining_credits,
                'days_left' => $activeSubscription->end_date ? (int) abs(now()->startOfDay()->diffInDays(Carbon::parse($activeSubscription->end_date)->startOfDay(), false)) : null,
            ] : [
                'name' => 'Sin plan activo',
                'status' => 'expired',
                'type' => null,
                'end_date' => null,
                'remaining_credits' => null,
                'days_left' => 0,
            ],
    // En el futuro podemos mandar aquí las clases próximas
            'upcoming_classes' => []
        ]);
    }

    /**
     * Cambiar la contraseña del miembro
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'La contraseña actual es incorrecta.'], 400);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }
}
