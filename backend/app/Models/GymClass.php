<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GymClass extends Model
{
    protected $table = 'gym_classes';

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }
}
