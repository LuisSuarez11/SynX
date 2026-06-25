<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MembershipController extends Controller
{
    /**
     * Listar todos los planes/membresías del tenant.
     */
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $memberships = Membership::where('tenant_id', $tenantId)
            ->withCount('subscriptions')
            ->orderBy('price', 'asc')
            ->get();

        return response()->json($memberships);
    }

    /**
     * Crear un nuevo plan.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'type'           => 'required|in:time_based,credit_based',
            'duration_days'  => 'required_if:type,time_based|nullable|integer|min:1',
            'credits_amount' => 'required_if:type,credit_based|nullable|integer|min:1',
            'price'          => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tenantId = $request->user()->tenant_id;

        $membership = Membership::create([
            'tenant_id'      => $tenantId,
            'name'           => $request->name,
            'type'           => $request->type,
            'duration_days'  => $request->duration_days,
            'credits_amount' => $request->credits_amount,
            'price'          => $request->price,
        ]);

        return response()->json($membership, 201);
    }

    /**
     * Obtener un plan específico.
     */
    public function show(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $membership = Membership::where('tenant_id', $tenantId)
            ->withCount('subscriptions')
            ->findOrFail($id);

        return response()->json($membership);
    }

    /**
     * Actualizar un plan.
     */
    public function update(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $membership = Membership::where('tenant_id', $tenantId)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'           => 'sometimes|string|max:255',
            'type'           => 'sometimes|in:time_based,credit_based',
            'duration_days'  => 'nullable|integer|min:1',
            'credits_amount' => 'nullable|integer|min:1',
            'price'          => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $membership->update($request->only([
            'name', 'type', 'duration_days', 'credits_amount', 'price'
        ]));

        return response()->json($membership);
    }

    /**
     * Eliminar un plan.
     */
    public function destroy(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;

        $membership = Membership::where('tenant_id', $tenantId)->findOrFail($id);

        // Verificar si tiene suscripciones activas
        $activeSubs = $membership->subscriptions()->where('status', 'active')->count();
        if ($activeSubs > 0) {
            return response()->json([
                'message' => "No se puede eliminar: hay {$activeSubs} suscripciones activas con este plan."
            ], 409);
        }

        $membership->delete();

        return response()->json(['message' => 'Plan eliminado correctamente']);
    }
}
