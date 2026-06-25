<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    /**
     * Listar managers del tenant actual
     */
    public function index(Request $request)
    {
        if ($request->user()->role !== 'owner') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $tenantId = $request->user()->tenant_id;
        
        $staff = User::where('tenant_id', $tenantId)
            ->where('role', 'manager')
            ->with('branch')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($staff);
    }

    /**
     * Crear un nuevo manager
     */
    public function store(Request $request)
    {
        if ($request->user()->role !== 'owner') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $tenantId = $request->user()->tenant_id;

        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'email'     => ['required', 'email', Rule::unique('users')->where(fn ($query) => $query->where('tenant_id', $tenantId))],
            'password'  => 'required|string|min:6',
            'branch_id' => 'required|exists:branches,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $manager = User::create([
            'tenant_id' => $tenantId,
            'branch_id' => $request->branch_id,
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'manager',
        ]);

        $manager->load('branch');

        return response()->json($manager, 201);
    }

    /**
     * Actualizar manager (ej: cambiar de sucursal)
     */
    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'owner') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $tenantId = $request->user()->tenant_id;

        $manager = User::where('tenant_id', $tenantId)
            ->where('role', 'manager')
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'      => 'sometimes|string|max:255',
            'email'     => ['sometimes', 'email', Rule::unique('users')->where(fn ($query) => $query->where('tenant_id', $tenantId))->ignore($manager->id)],
            'branch_id' => 'sometimes|required|exists:branches,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $manager->update($request->only(['name', 'email', 'branch_id']));

        if ($request->has('password') && $request->password) {
            $manager->update(['password' => Hash::make($request->password)]);
        }

        $manager->load('branch');

        return response()->json($manager);
    }

    /**
     * Eliminar manager
     */
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'owner') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $tenantId = $request->user()->tenant_id;

        $manager = User::where('tenant_id', $tenantId)
            ->where('role', 'manager')
            ->findOrFail($id);

        $manager->delete();

        return response()->json(['message' => 'Encargado eliminado correctamente']);
    }
}
