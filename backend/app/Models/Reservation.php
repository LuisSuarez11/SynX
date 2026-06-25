<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'class_schedule_id',
        'reserved_date',
        'status',           // 'confirmed', 'cancelled', 'attended'
        'credits_used',
    ];

    protected function casts(): array
    {
        return [
            'reserved_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class);
    }
}
