<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;

class BranchController extends Controller
{
    /**
     * Listar todas las sucursales del tenant actual.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'owner') {
            $branches = Branch::where('tenant_id', $user->tenant_id)->get();
        } else {
            $branches = Branch::where('id', $user->branch_id)->get();
        }
        
        return response()->json(['branches' => $branches]);
    }

    /**
     * Crear nueva sucursal (solo owner)
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'owner') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
        ]);

        $branch = Branch::create([
            'tenant_id' => $user->tenant_id,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
        ]);

        return response()->json(['message' => 'Sucursal creada exitosamente', 'branch' => $branch], 201);
    }

    /**
     * Actualizar sucursal (solo owner)
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'owner') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $branch = Branch::where('id', $id)->where('tenant_id', $user->tenant_id)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
        ]);

        $branch->update($request->only(['name', 'address', 'phone']));

        return response()->json(['message' => 'Sucursal actualizada exitosamente', 'branch' => $branch]);
    }

    /**
     * Eliminar sucursal (solo owner)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'owner') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $branch = Branch::where('id', $id)->where('tenant_id', $user->tenant_id)->firstOrFail();
        
        
        $branch->delete();

        return response()->json(['message' => 'Sucursal eliminada exitosamente']);
    }
}
