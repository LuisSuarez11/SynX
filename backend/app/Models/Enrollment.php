<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $fillable = [
        'class_schedule_id',
        'user_id',
        'status', 
    ];

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
