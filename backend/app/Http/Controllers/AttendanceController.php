<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Listar asistencias del día (o por fecha) del tenant/sucursal actual
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $date = $request->query('date', today()->toDateString());

        $query = Attendance::where('tenant_id', $tenantId)
            ->whereDate('check_in_time', $date)
            ->with(['user:id,name,email,ci_number', 'branch:id,name']);

        $branchId = $user->role === 'manager' ? $user->branch_id : $request->query('branch_id');
        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        $attendances = $query->orderBy('check_in_time', 'desc')->get();

        return response()->json([
            'date'        => $date,
            'total'       => $attendances->count(),
            'attendances' => $attendances,
        ]);
    }

    /**
     * Registrar entrada de un miembro (por CI o nombre)
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;
        $branchId = $user->role === 'manager' ? $user->branch_id : ($request->branch_id ?? $user->branch_id);

        $request->validate([
            'search' => 'required|string|min:2',
        ]);

        // Buscar miembro por CI, QR Token o nombre
        $member = User::where('tenant_id', $tenantId)
            ->where('role', 'member')
            ->where(function ($q) use ($request) {
                $q->where('ci_number', $request->search)
                  ->orWhere('qr_token', $request->search)
                  ->orWhere('name', 'like', "%{$request->search}%");
            })
            ->first();

        if (!$member) {
            return response()->json(['error' => 'Miembro no encontrado con ese CI o nombre.'], 404);
        }

        // Si es manager, no debería poder registrar a alguien de otra sucursal
        if ($user->role === 'manager' && $member->branch_id !== $user->branch_id) {
            return response()->json(['error' => 'Este miembro pertenece a otra sucursal.'], 403);
        }

        // Verificar que tiene membresía activa
        $activeSub = $member->subscriptions()
            ->with('membership')
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('end_date')
                  ->orWhereDate('end_date', '>=', today());
            })
            ->first();

        $isCreditBased = $activeSub && $activeSub->membership && $activeSub->membership->type === 'credit_based';

        // Si es por créditos, validar que tenga créditos disponibles
        if ($isCreditBased && $activeSub->remaining_credits <= 0) {
            $activeSub = null;
        }

        // Evitar doble escaneo accidental (cooldown de 2 minutos para todos)
        $recentEntry = Attendance::where('user_id', $member->id)
            ->where('check_in_time', '>=', now()->subMinutes(2))
            ->exists();

        if ($recentEntry) {
            return response()->json([
                'error'  => 'Entrada ya registrada hace un momento. Por favor espera unos minutos para volver a escanear.',
                'member' => $member->only(['id', 'name', 'ci_number']),
            ], 409);
        }

        // Para planes de "Sesión Única" (créditos), limitamos a 1 entrada por día para no gastar sus créditos por accidente si salen a la tienda y vuelven.
        if ($isCreditBased) {
            $alreadyInToday = Attendance::where('user_id', $member->id)
                ->whereDate('check_in_time', today())
                ->exists();

            if ($alreadyInToday) {
                return response()->json([
                    'error'  => 'Este miembro ya utilizó su pase de Sesión Única por hoy.',
                    'member' => $member->only(['id', 'name', 'ci_number']),
                ], 409);
            }
        }

        $attendance = Attendance::create([
            'tenant_id'     => $tenantId,
            'branch_id'     => $branchId ?? $member->branch_id,
            'user_id'       => $member->id,
            'check_in_time' => now(),
        ]);

        if ($isCreditBased && $activeSub) {
            $activeSub->decrement('remaining_credits');
        }

        $attendance->load(['user:id,name,email,ci_number', 'branch:id,name']);

        return response()->json([
            'message'       => "Acceso registrado para {$member->name}",
            'attendance'    => $attendance,
            'has_active_sub' => (bool) $activeSub,
            'warning'       => !$activeSub ? '⚠️ Este miembro NO tiene membresía activa.' : null,
        ], 201);
    }

    /**
     * Estadísticas rápidas de asistencia (para el dashboard)
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $query = Attendance::where('tenant_id', $tenantId);

        $branchId = $user->role === 'manager' ? $user->branch_id : $request->query('branch_id');
        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        return response()->json([
            'hoy'     => (clone $query)->whereDate('check_in_time', today())->count(),
            'semana'  => (clone $query)->whereBetween('check_in_time', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'mes'     => (clone $query)->whereMonth('check_in_time', now()->month)->count(),
        ]);
    }
}
