<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'price',
        'duration_days',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
