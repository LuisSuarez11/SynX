<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Membership extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'type',           // 'time_based' o 'credit_based'
        'duration_days',
        'credits_amount',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
