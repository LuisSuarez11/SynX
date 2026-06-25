<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Branch;
use App\Models\Membership;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Str;

$owner = User::where('role', 'owner')->first();
if (!$owner) die("No owner found.");
$tenantId = $owner->tenant_id;

$banzer = Branch::where('name', 'like', '%banzer%')->first();
$branchId = $banzer->id;

$memberships = Membership::where('tenant_id', $tenantId)->get();

if ($memberships->count() === 0) die("No memberships found.");

echo "Cleaning up old demo data...\n";
// Buscar usuarios demo
$demoUsers = User::where('tenant_id', $tenantId)
    ->where('branch_id', $branchId)
    ->where('email', 'like', 'demo%@gmail.com')
    ->get();

foreach ($demoUsers as $du) {
    Attendance::where('user_id', $du->id)->delete();
    Payment::where('user_id', $du->id)->delete();
    Subscription::where('user_id', $du->id)->delete();
    $du->delete();
}
echo "Cleanup completed.\n";

echo "Seeding data for Banzer branch...\n";

$now = Carbon::now();

// Crear 20 usuarios fake
for ($i = 0; $i < 20; $i++) {
    $user = User::create([
        'tenant_id' => $tenantId,
        'branch_id' => $branchId,
        'name' => 'Demo User ' . rand(100, 999),
        'email' => 'demo' . rand(1000, 9999) . '@gmail.com',
        'password' => bcrypt('password'),
        'role' => 'member',
        'ci_number' => rand(1000000, 9999999),
        'qr_token' => Str::random(12),
        'created_at' => $now->copy()->subMonths(rand(0, 5))
    ]);

    // Crear 1 a 3 suscripciones para este usuario en el pasado
    $numSubs = rand(1, 3);
    for ($s = 0; $s < $numSubs; $s++) {
        $membership = $memberships->random();
        $start = $now->copy()->subMonths(rand(0, 5))->subDays(rand(1, 28));
        $end = $membership->type === 'time_based' ? $start->copy()->addDays($membership->duration_days) : null;
        
        $status = 'expired';
        if ($end && $end->isFuture()) $status = 'active';

        $sub = Subscription::create([
            'user_id' => $user->id,
            'membership_id' => $membership->id,
            'branch_id' => $branchId,
            'start_date' => $start,
            'end_date' => $end,
            'status' => $status,
            'remaining_credits' => $membership->type === 'credit_based' ? rand(0, 10) : null,
            'created_at' => $start
        ]);

        Payment::create([
            'tenant_id' => $tenantId,
            'user_id' => $user->id,
            'subscription_id' => $sub->id,
            'amount' => $membership->price,
            'payment_method' => 'efectivo',
            'payment_date' => $start,
            'created_at' => $start
        ]);

        // Crear asistencias para esta suscripción en el pasado
        $numAsis = rand(5, 15);
        for ($a = 0; $a < $numAsis; $a++) {
            $asisDate = $start->copy()->addDays(rand(1, 30));
            // Fijar hora antes de validar para evitar empujarla al futuro
            $asisDate->setHour(rand(6, 21))->setMinute(rand(0, 59))->setSecond(0);
            if ($asisDate->isPast() && !$asisDate->isToday()) {
                Attendance::create([
                    'tenant_id' => $tenantId,
                    'branch_id' => $branchId,
                    'user_id' => $user->id,
                    'check_in_time' => $asisDate
                ]);
            }
        }
    }
}

// Ahora inyectar asistencias específicas para HOY para que la gráfica de hoy y la lista de recientes coincidan
echo "Seeding check-ins for today...\n";
$todayMembers = User::where('tenant_id', $tenantId)
    ->where('branch_id', $branchId)
    ->where('role', 'member')
    ->limit(4)
    ->get();

// Crear 4 asistencias en el día de hoy distribuidas en las últimas horas
$hoursAgo = [1, 3, 5, 8];
foreach ($todayMembers as $index => $m) {
    if (isset($hoursAgo[$index])) {
        Attendance::create([
            'tenant_id' => $tenantId,
            'branch_id' => $branchId,
            'user_id' => $m->id,
            'check_in_time' => $now->copy()->subHours($hoursAgo[$index])
        ]);
    }
}

echo "Done seeding.\n";

