<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Branch;
use App\Models\Membership;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear el Tenant (Franquicia)
        $tenant = Tenant::create([
            'name' => 'AESGYM',
            'slug' => 'aesgym',
            'plan' => 'enterprise'
        ]);

        // 2. Crear las 7 Sucursales
        $branches = [
            'AESGYM Piraí',
            'AESGYM Equipetrol',
            'AESGYM Radial 17 1/2',
            'AESGYM 24hrs',
            'AESGYM Banzer',
            'AESGYM Satélite',
            'AESGYM Centro'
        ];

        foreach ($branches as $branchName) {
            Branch::create([
                'tenant_id' => $tenant->id,
                'name' => $branchName,
                'location' => 'Santa Cruz, Bolivia'
            ]);
        }

        // 3. Crear el Dueño (Owner)
        User::create([
            'tenant_id' => $tenant->id,
            'branch_id' => null, // Acceso a todas las sucursales
            'name' => 'Saul Camacho',
            'email' => 'saul.camacho@aesgym.com',
            'password' => Hash::make('password123'),
            'role' => 'owner',
            'ci_number' => '1234567',
            'qr_token' => Str::random(10)
        ]);

        // Crear un SuperAdmin de SynX (Nosotros)
        User::create([
            'tenant_id' => null,
            'branch_id' => null,
            'name' => 'Luis Suarez (SynX)',
            'email' => 'admin@synx.com',
            'password' => Hash::make('admin123'),
            'role' => 'superadmin',
            'ci_number' => '0000000',
            'qr_token' => Str::random(10)
        ]);

        // 4. Crear los Planes (Memberships)
        $plans = [
            ['name' => 'Mensual', 'type' => 'time_based', 'duration_days' => 30, 'credits_amount' => null, 'price' => 260],
            ['name' => 'Estudiantes', 'type' => 'time_based', 'duration_days' => 30, 'credits_amount' => null, 'price' => 230],
            ['name' => 'Grupal', 'type' => 'time_based', 'duration_days' => 30, 'credits_amount' => null, 'price' => 600],
            ['name' => 'Trimestral', 'type' => 'time_based', 'duration_days' => 90, 'credits_amount' => null, 'price' => 650],
            ['name' => 'Semestral', 'type' => 'time_based', 'duration_days' => 180, 'credits_amount' => null, 'price' => 1100],
            ['name' => 'Anual', 'type' => 'time_based', 'duration_days' => 365, 'credits_amount' => null, 'price' => 1950],
            ['name' => 'Ejecutivo', 'type' => 'credit_based', 'duration_days' => 90, 'credits_amount' => 30, 'price' => 350],
            ['name' => 'Sesión única', 'type' => 'credit_based', 'duration_days' => 1, 'credits_amount' => 1, 'price' => 25],
            ['name' => 'Plan Full', 'type' => 'time_based', 'duration_days' => 30, 'credits_amount' => null, 'price' => 280],
        ];

        foreach ($plans as $plan) {
            Membership::create([
                'tenant_id' => $tenant->id,
                'name' => $plan['name'],
                'type' => $plan['type'],
                'duration_days' => $plan['duration_days'],
                'credits_amount' => $plan['credits_amount'],
                'price' => $plan['price'],
            ]);
        }

        // 5. Llamar al seeder de datos de prueba transaccionales
        $this->call(DemoDataSeeder::class);
    }
}
