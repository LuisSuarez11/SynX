<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$banzer = \App\Models\Branch::where('name', 'like', '%banzer%')->first();
echo "Banzer ID: " . $banzer->id . "\n";

$manager = \App\Models\User::where('role', 'manager')->where('branch_id', $banzer->id)->first();
echo "Manager: " . ($manager ? $manager->name : 'None') . "\n";

$members = \App\Models\User::where('role', 'member')->where('branch_id', $banzer->id)->count();
echo "Members in Banzer: " . $members . "\n";

$payments = \App\Models\Payment::where('branch_id', $banzer->id)->count();
echo "Payments in Banzer: " . $payments . "\n";

$subs = \App\Models\Subscription::whereHas('user', function($q) use ($banzer) {
    $q->where('branch_id', $banzer->id);
})->count();
echo "Subs in Banzer: " . $subs . "\n";

