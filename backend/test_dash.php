<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $banzer = \App\Models\Branch::where('name', 'like', '%banzer%')->first();
    $user = \App\Models\User::where('role', 'manager')->where('branch_id', $banzer->id)->first();
    echo "User: " . $user->name . " (Branch ID: " . $user->branch_id . ")\n";
    
    $req = \Illuminate\Http\Request::create('/api/admin/dashboard', 'GET');
    $req->setUserResolver(function() use ($user) { return $user; });
    
    $controller = new \App\Http\Controllers\DashboardController();
    $res = $controller->getStats($req);
    echo $res->getContent();
} catch (\Exception $e) {
    echo "ERROR:\n" . $e->getMessage() . "\n" . $e->getTraceAsString();
}
