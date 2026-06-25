<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    protected $fillable = [
        'gym_class_id',
        'branch_id',
        'instructor_id',
        'day_of_week',
        'start_time',
        'end_time',
        'capacity',
    ];

    public function gymClass()
    {
        return $this->belongsTo(GymClass::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
