<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'address',
        'phone',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
