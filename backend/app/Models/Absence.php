<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'class_schedule_id',
        'date',
        'reason',
        'credits_refunded',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'credits_refunded' => 'boolean',
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
