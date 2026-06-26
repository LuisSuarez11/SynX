<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Membership;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    /**
     * Listar suscripciones del tenant (con filtros).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $query = Subscription::whereHas('user', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
        })->with(['user', 'membership', 'branch']);

        
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        
        $branchId = $user->role === 'manager' ? $user->branch_id : $request->query('branch_id');
        if ($branchId) {
            $query->where('branch_id', $branchId)
                  ->orWhereHas('user', function ($q) use ($branchId) {
                      $q->where('branch_id', $branchId);
                  });
        }

        $subscriptions = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($subscriptions);
    }

    /**
     * Asignar un plan a un miembro (crear suscripción + pago opcional).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'       => 'required|exists:users,id',
            'membership_id' => 'required|exists:memberships,id',
            'branch_id'     => 'nullable|exists:branches,id',
            'register_payment' => 'sometimes|boolean',
            'payment_method'   => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tenantId = $request->user()->tenant_id;
        $membership = Membership::where('tenant_id', $tenantId)->findOrFail($request->membership_id);

        
        $activeSubscription = Subscription::where('user_id', $request->user_id)
            ->whereIn('status', ['active', 'pending'])
            ->orderBy('end_date', 'desc')
            ->first();

        $startDate = now();
        $status = 'active';

        
        if ($activeSubscription && $activeSubscription->end_date && \Carbon\Carbon::parse($activeSubscription->end_date)->gte(now()->startOfDay())) {
            $startDate = \Carbon\Carbon::parse($activeSubscription->end_date);
            $status = 'pending'; 
        }

        
        $subscription = Subscription::create([
            'user_id'           => $request->user_id,
            'membership_id'     => $membership->id,
            'branch_id'         => $request->branch_id,
            'start_date'        => $startDate,
            'end_date'          => $membership->type === 'time_based'
                ? $startDate->copy()->addDays($membership->duration_days)
                : null,
            'remaining_credits' => $membership->type === 'credit_based'
                ? $membership->credits_amount
                : null,
            'status'            => $status,
        ]);

        
        if ($request->register_payment) {
            Payment::create([
                'tenant_id'       => $tenantId,
                'branch_id'       => $request->branch_id,
                'user_id'         => $request->user_id,
                'subscription_id' => $subscription->id,
                'amount'          => $membership->price,
                'payment_method'  => $request->payment_method ?? 'efectivo',
                'payment_date'    => now(),
            ]);
        }

        $subscription->load(['user', 'membership', 'branch']);

        return response()->json($subscription, 201);
    }

    /**
     * Cancelar una suscripción.
     */
    public function destroy(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $subscription = Subscription::whereHas('user', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
        })->findOrFail($id);

        $subscription->update(['status' => 'expired']);

        return response()->json(['message' => 'Suscripción cancelada correctamente']);
    }
}
