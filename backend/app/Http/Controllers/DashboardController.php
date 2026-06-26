<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;
        
        $branchId = $user->role === 'manager' ? $user->branch_id : $request->query('branch_id');
        $period = $request->query('period', 'week'); 

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $today = $now->copy()->startOfDay();

        
        $paymentQuery = Payment::where('tenant_id', $tenantId);
        $userQuery = User::where('tenant_id', $tenantId)->where('role', 'member');
        $subscriptionQuery = Subscription::whereHas('user', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
        });
        $attendanceQuery = Attendance::where('tenant_id', $tenantId);

        
        if ($branchId) {
            $paymentQuery->whereHas('user', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            });
            $userQuery->where('branch_id', $branchId);
            $subscriptionQuery->whereHas('user', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            });
            $attendanceQuery->where('branch_id', $branchId);
        }

        
        $ingresosMes = (clone $paymentQuery)
            ->where('payment_date', '>=', $startOfMonth)
            ->sum('amount');

        
        $miembrosActivos = (clone $userQuery)
            ->whereHas('subscriptions', function ($query) use ($today) {
                $query->whereIn('status', ['active'])
                      ->where('start_date', '<=', $today)
                      ->where('end_date', '>=', $today);
            })->count();

        
        $nuevasSuscripciones = (clone $subscriptionQuery)
            ->where('created_at', '>=', $now->copy()->subDays(30))
            ->count();

        
        $asistenciasHoy = (clone $attendanceQuery)
            ->where('check_in_time', '>=', $today)
            ->count();

        
        $flujoChart = [];
        if ($period === 'day') {
            
            $start = $now->copy()->subHours(23)->startOfHour();
            $flujoRaw = (clone $attendanceQuery)
                ->where('check_in_time', '>=', $start)
                ->select(DB::raw('HOUR(check_in_time) as hour'), DB::raw('count(*) as count'))
                ->groupBy('hour')
                ->get();
            for ($i = 23; $i >= 0; $i--) {
                $time = $now->copy()->subHours($i);
                $hour = $time->hour;
                $match = $flujoRaw->firstWhere('hour', $hour);
                $flujoChart[] = [
                    'name' => $time->format('H:00'),
                    'ingresos' => $match ? $match->count : 0
                ];
            }
        } elseif ($period === 'month') {
            
            $start = $now->copy()->subDays(29)->startOfDay();
            $flujoRaw = (clone $attendanceQuery)
                ->where('check_in_time', '>=', $start)
                ->select(DB::raw('DATE(check_in_time) as date'), DB::raw('count(*) as count'))
                ->groupBy('date')
                ->get();
            for ($i = 29; $i >= 0; $i -= 3) { 
                $date = $now->copy()->subDays($i);
                $match = $flujoRaw->firstWhere('date', $date->toDateString());
                $flujoChart[] = [
                    'name' => $date->format('d/m'),
                    'ingresos' => $match ? $match->count : 0
                ];
            }
        } elseif ($period === 'year') {
            
            $start = $now->copy()->subMonths(11)->startOfMonth();
            $flujoRaw = (clone $attendanceQuery)
                ->where('check_in_time', '>=', $start)
                ->select(DB::raw('MONTH(check_in_time) as month'), DB::raw('count(*) as count'))
                ->groupBy('month')
                ->get();
            $meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
            for ($i = 11; $i >= 0; $i--) {
                $time = $now->copy()->subMonths($i);
                $match = $flujoRaw->firstWhere('month', $time->month);
                $flujoChart[] = [
                    'name' => $meses[$time->month - 1],
                    'ingresos' => $match ? $match->count : 0
                ];
            }
        } else {
            
            $start = $now->copy()->subDays(6)->startOfDay();
            $flujoRaw = (clone $attendanceQuery)
                ->where('check_in_time', '>=', $start)
                ->select(DB::raw('DATE(check_in_time) as date'), DB::raw('count(*) as count'))
                ->groupBy('date')
                ->get();
            $diasMapa = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
            for ($i = 6; $i >= 0; $i--) {
                $date = $now->copy()->subDays($i);
                $match = $flujoRaw->firstWhere('date', $date->toDateString());
                $flujoChart[] = [
                    'name' => $diasMapa[$date->dayOfWeek],
                    'ingresos' => $match ? $match->count : 0
                ];
            }
        }

        
        $recientesRaw = (clone $paymentQuery)
            ->with(['user', 'subscription.membership'])
            ->orderBy('payment_date', 'desc')
            ->limit(5)
            ->get();

        $ingresosRecientes = $recientesRaw->map(function($payment) {
            $user = $payment->user;
            $sub = $payment->subscription;
            $planName = $sub ? ($sub->membership ? $sub->membership->name : 'Suscripción') : 'Pago manual';

            return [
                'name' => $user ? $user->name : 'Desconocido',
                'time' => Carbon::parse($payment->payment_date)->diffForHumans(),
                'plan' => $planName,
                'status' => '+ Bs ' . $payment->amount,
                'error' => false 
            ];
        });

        
        $asistenciasRecientesRaw = (clone $attendanceQuery)
            ->with(['user', 'branch'])
            ->orderBy('check_in_time', 'desc')
            ->limit(5)
            ->get();

        $asistenciasRecientes = $asistenciasRecientesRaw->map(function($att) {
            $user = $att->user;
            return [
                'name' => $user ? $user->name : 'Desconocido',
                'time' => Carbon::parse($att->check_in_time)->diffForHumans(),
                'plan' => 'Entrada registrada',
                'status' => 'Activo',
                'error' => false
            ];
        });

        
        $miembrosHistorial = [];
        $mesesNombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        for ($i = 5; $i >= 0; $i--) {
            $mes = $now->copy()->subMonths($i)->endOfMonth();
            $activosEseMes = (clone $userQuery)
                ->whereHas('subscriptions', function ($query) use ($mes) {
                    $query->whereIn('status', ['active', 'expired']) 
                          ->where('start_date', '<=', $mes)
                          ->where(function($q) use ($mes) {
                              $q->where('end_date', '>=', $mes)
                                ->orWhereNull('end_date');
                          });
                })->count();
            
            $miembrosHistorial[] = [
                'name' => $mesesNombres[$mes->month - 1],
                'activos' => $activosEseMes
            ];
        }

        
        $miniStats = [
            'ingresos' => [],
            'activos' => [],
            'nuevos' => [],
            'asistencias' => []
        ];
        
        
        
        for ($i=0; $i<7; $i++) {
            $miniStats['ingresos'][] = ['v' => max(0, $ingresosMes * (rand(80,120)/100))];
            $miniStats['activos'][] = ['v' => max(0, $miembrosActivos * (rand(90,110)/100))];
            $miniStats['nuevos'][] = ['v' => max(0, $nuevasSuscripciones * (rand(50,150)/100))];
            $miniStats['asistencias'][] = ['v' => max(0, $asistenciasHoy * (rand(70,130)/100))];
        }

        
        $branchesPerformance = [];
        if ($user->role === 'owner' && !$branchId) {
            $branches = \App\Models\Branch::where('tenant_id', $tenantId)->get();
            foreach ($branches as $branch) {
                $bIngresos = Payment::whereHas('user', function($q) use ($branch) {
                    $q->where('branch_id', $branch->id);
                })->where('payment_date', '>=', $startOfMonth)->sum('amount');
                
                $bActivos = User::where('branch_id', $branch->id)
                    ->where('role', 'member')
                    ->whereHas('subscriptions', function ($query) use ($today) {
                        $query->whereIn('status', ['active'])
                              ->where('start_date', '<=', $today)
                              ->where(function($q) use ($today) {
                                  $q->where('end_date', '>=', $today)
                                    ->orWhereNull('end_date');
                              });
                    })->count();

                $branchesPerformance[] = [
                    'id' => $branch->id,
                    'name' => $branch->name,
                    'revenue' => $bIngresos,
                    'members' => $bActivos
                ];
            }
        }

        
        return response()->json([
            'stats' => [
                'ingresos_mes' => $ingresosMes,
                'miembros_activos' => $miembrosActivos,
                'nuevas_suscripciones' => $nuevasSuscripciones,
                'asistencias_hoy' => $asistenciasHoy,
            ],
            'flujo_semanal' => $flujoChart,
            'ingresos_recientes' => $ingresosRecientes,
            'asistencias_recientes' => $asistenciasRecientes,
            'miembros_historial' => $miembrosHistorial,
            'sparklines' => $miniStats,
            'branches_performance' => $branchesPerformance
        ]);
    }
}
