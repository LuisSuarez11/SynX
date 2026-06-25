<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tenant;
use App\Models\Branch;
use App\Models\Membership;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::where('slug', 'aesgym')->first();
        if (!$tenant) return;

        $branches = Branch::where('tenant_id', $tenant->id)->get();
        $memberships = Membership::where('tenant_id', $tenant->id)->get();

        if ($branches->isEmpty() || $memberships->isEmpty()) return;

        $paymentsData = [];
        $attendancesData = [];

        $classmates = [
            'Mateo Salazar Mitchell', 'Said Montano Condori', 'Luis Andres Suarez Andrade', 
            'Mikaela Gutierrez Urquiza', 'Aldo Gabriel Flores Maquera', 'Sofia Cuellar Roca', 
            'Lucas Boris Gomez Giles', 'Mateo Sebastian Morales', 'Deibi Frandulcardo Cruz', 
            'Franco Andres Salas Gutierrez', 'Matias Raldes Leon', 'Matias Nahim Justiniano', 
            'Roderick Cesar Bayes Urbano', 'Walkyria Nicole Audivert Lino', 'Diego Aron Dell Fernandez',
            'Jorge Luis Herbas Mallcu', 'Cristhian Arispe Vargas', 'Sebastian Maldonado Salazar',
            'Liz Aneli Vargas Ortiz', 'Leonardo Ariel Albornos', 'Matias Ruiz Decourt',
            'Angel Sebastian Eguez Mur', 'Matias Ethan Cordova', 'Omar Caleb Fernandez Lopez',
            'Nicolas Colautti Rodriguez', 'Pablo Ricardo Quiroz', 'Ruth Eva Toro Nogales',
            'Julio Guzman Almanza', 'Jose Elvis Martinez Zabala', 'Rene Aaron Sendoya',
            'Santiago Roca Martinez', 'Sebastian Tejerina Ramos', 'Pablo Hugo Rocabado Castel',
            'Fernando Andres Castedo', 'Karen Cecilia Caral Basilio', 'Carlos Josue Padilla Rosales',
            'Johan Andersson De Carvalho', 'Pablo Adrian Castedo Rojas', 'Didier Flores Saucedo'
        ];

        $now = Carbon::now();
        $paymentMethods = ['cash', 'qr_transfer', 'card'];

        foreach ($classmates as $index => $name) {
            $branch = $branches->random();
            $membership = $memberships->random();
            
            $statusCategory = rand(1, 100);
            
            if ($statusCategory <= 40) {
                // 40% Activos normales (comprados recientemente)
                $isActive = true;
                $startDate = (clone $now)->subDays(rand(0, 15));
            } elseif ($statusCategory <= 75) {
                // 35% Por vencer (expiring_soon en 1 a 5 días)
                $isActive = true;
                if ($membership->type === 'time_based') {
                    $daysAgo = $membership->duration_days - rand(1, 5);
                    // Asegurarse de no usar valores negativos
                    if ($daysAgo < 0) $daysAgo = 0;
                    $startDate = (clone $now)->subDays($daysAgo);
                } else {
                    $startDate = (clone $now)->subDays(rand(0, 20));
                }
            } else {
                // 25% Vencidos hace mucho
                $isActive = false;
                $startDate = (clone $now)->subDays(rand(60, 180));
            }
            
            $endDate = null;
            $remainingCredits = null;
            
            if ($membership->type === 'time_based') {
                $endDate = (clone $startDate)->addDays($membership->duration_days);
                if ($endDate->isPast()) $isActive = false;
            } else {
                $remainingCredits = $isActive ? rand(1, $membership->credits_amount) : 0;
            }

            // Crear mail a partir del nombre
            $emailPrefix = strtolower(str_replace(' ', '.', $name));
            $email = $emailPrefix . '@estudiante.com';
            
            // CI ficticio
            $ci = '800' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);

            $userId = DB::table('users')->insertGetId([
                'tenant_id' => $tenant->id,
                'branch_id' => $branch->id,
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => 'member',
                'ci_number' => $ci,
                'qr_token' => Str::random(10),
                'created_at' => $startDate,
                'updated_at' => $startDate,
            ]);

            $subId = DB::table('subscriptions')->insertGetId([
                'user_id' => $userId,
                'membership_id' => $membership->id,
                'branch_id' => $branch->id,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate ? $endDate->toDateString() : null,
                'remaining_credits' => $remainingCredits,
                'status' => $isActive ? 'active' : 'expired',
                'created_at' => $startDate,
                'updated_at' => $startDate,
            ]);

            $paymentsData[] = [
                'tenant_id' => $tenant->id,
                'user_id' => $userId,
                'subscription_id' => $subId,
                'amount' => $membership->price,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'payment_date' => $startDate,
                'created_at' => $startDate,
                'updated_at' => $startDate,
            ];

            if ($isActive) {
                // Generar entre 2 y 8 asistencias
                $numAttendances = rand(2, 8);
                for ($a = 0; $a < $numAttendances; $a++) {
                    $attDate = (clone $now)->subDays(rand(0, 6))->setHour(rand(6, 21))->setMinute(rand(0, 59));
                    if ($attDate->greaterThanOrEqualTo($startDate)) {
                        $attendancesData[] = [
                            'tenant_id' => $tenant->id,
                            'branch_id' => $branch->id,
                            'user_id' => $userId,
                            'class_schedule_id' => null,
                            'check_in_time' => $attDate,
                            'check_out_time' => (clone $attDate)->addHours(rand(1, 2)),
                            'created_at' => $attDate,
                            'updated_at' => $attDate,
                        ];
                    }
                }
            }
        }

        if (!empty($paymentsData)) DB::table('payments')->insert($paymentsData);
        if (!empty($attendancesData)) DB::table('attendances')->insert($attendancesData);
    }
}
