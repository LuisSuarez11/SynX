<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subscription;
use App\Models\Membership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    /**
     * Listar todos los miembros del tenant actual.
     * Soporta: búsqueda, filtro por estado, paginación.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $query = User::where('tenant_id', $tenantId)
            ->where('role', 'member')
            ->with(['branch', 'subscriptions.membership']);

        
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('ci_number', 'like', "%{$search}%");
            });
        }

        
        if ($status = $request->query('status')) {
            if ($status === 'active') {
                $query->whereHas('subscriptions', function ($q) {
                    $q->where('status', 'active')
                      ->where(function ($subQ) {
                          $subQ->whereNull('end_date')
                               ->orWhereDate('end_date', '>=', today());
                      });
                });
            } elseif ($status === 'expired') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('subscriptions')
                      ->orWhereDoesntHave('subscriptions', function ($sq) {
                          $sq->where('status', 'active')
                             ->where(function ($subQ) {
                                 $subQ->whereNull('end_date')
                                      ->orWhereDate('end_date', '>=', today());
                             });
                      });
                });
            } elseif ($status === 'expiring_soon') {
                $query->whereHas('subscriptions', function ($q) {
                    $q->where('status', 'active')
                      ->whereNotNull('end_date')
                      ->whereBetween('end_date', [today(), today()->addDays(5)]);
                });
            }
        }

        
        $branchId = $user->role === 'manager' ? $user->branch_id : $request->query('branch_id');
        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        $members = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($members);
    }

    /**
     * Obtener un miembro específico con toda su info.
     */
    public function show(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $member = User::where('tenant_id', $tenantId)
            ->where('role', 'member')
            ->with(['branch', 'subscriptions.membership', 'subscriptions' => function ($q) {
                $q->orderBy('created_at', 'desc');
            }])
            ->findOrFail($id);

        return response()->json($member);
    }

    /**
     * Crear un nuevo miembro.
     */
    public function store(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'email'         => ['required', 'email', Rule::unique('users')->where(fn ($query) => $query->where('tenant_id', $tenantId))],
            'ci_number'     => ['nullable', 'string', Rule::unique('users')->where(fn ($query) => $query->where('tenant_id', $tenantId))],
            'password'      => 'nullable|string|min:6',
            'branch_id'     => 'nullable|exists:branches,id',
            'membership_id' => 'nullable|exists:memberships,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        
        $member = User::create([
            'tenant_id' => $tenantId,
            'branch_id' => $request->branch_id,
            'name'      => $request->name,
            'email'     => $request->email,
            'ci_number' => $request->ci_number,
            'password'  => Hash::make($request->password ?? $request->ci_number ?? 'synx1234'), 
            'role'      => 'member',
            'qr_token'  => Str::random(12),
        ]);

        
        if ($request->membership_id) {
            $membership = Membership::where('tenant_id', $tenantId)->findOrFail($request->membership_id);

            Subscription::create([
                'user_id'           => $member->id,
                'membership_id'     => $membership->id,
                'branch_id'         => $request->branch_id,
                'start_date'        => now(),
                'end_date'          => $membership->type === 'time_based'
                    ? now()->addDays($membership->duration_days)
                    : null,
                'remaining_credits' => $membership->type === 'credit_based'
                    ? $membership->credits_amount
                    : null,
                'status'            => 'active',
            ]);
        }

        $member->load(['branch', 'subscriptions.membership']);

        return response()->json($member, 201);
    }

    /**
     * Actualizar datos de un miembro.
     */
    public function update(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $member = User::where('tenant_id', $tenantId)
            ->where('role', 'member')
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'      => 'sometimes|string|max:255',
            'email'     => ['sometimes', 'email', Rule::unique('users')->where(fn ($query) => $query->where('tenant_id', $tenantId))->ignore($member->id)],
            'ci_number' => ['sometimes', 'nullable', 'string', Rule::unique('users')->where(fn ($query) => $query->where('tenant_id', $tenantId))->ignore($member->id)],
            'branch_id' => 'sometimes|nullable|exists:branches,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $member->update($request->only(['name', 'email', 'ci_number', 'branch_id']));

        if ($request->has('password') && $request->password) {
            $member->update(['password' => Hash::make($request->password)]);
        }

        $member->load(['branch', 'subscriptions.membership']);

        return response()->json($member);
    }

    /**
     * Eliminar un miembro (soft: lo desactiva).
     */
    public function destroy(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $member = User::where('tenant_id', $tenantId)
            ->where('role', 'member')
            ->findOrFail($id);

        
        $member->subscriptions()->where('status', 'active')->update(['status' => 'expired']);

        $member->delete();

        return response()->json(['message' => 'Miembro eliminado correctamente']);
    }
}
