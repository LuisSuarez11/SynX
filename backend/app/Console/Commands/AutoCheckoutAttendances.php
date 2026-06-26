<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AutoCheckoutAttendances extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:checkout-auto';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cierra automáticamente la sesión de miembros tras 2 horas de check-in';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limitTime = now()->subMinutes(120);

        
        $attendances = \App\Models\Attendance::whereNull('check_out')
            ->where('check_in_time', '<=', $limitTime)
            ->get();

        $count = 0;
        foreach ($attendances as $attendance) {
            
            $attendance->check_out = \Carbon\Carbon::parse($attendance->check_in_time)->addMinutes(120);
            $attendance->save();
            $count++;
        }

        $this->info("Auto Check-out completado. Registros actualizados: {$count}");
    }
}
