<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'tenant_id',
        'branch_id',
        'user_id',
        'check_in_time',
        'check_out_time',
        'access_method',   // 'qr', 'nfc', 'manual'
    ];

    protected function casts(): array
    {
        return [
            'check_in_time' => 'datetime',
            'check_out_time' => 'datetime',
        ];
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
