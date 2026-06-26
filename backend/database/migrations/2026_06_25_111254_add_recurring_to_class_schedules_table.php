<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('class_schedules', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(true)->after('instructor_id');
            $table->date('specific_date')->nullable()->after('day_of_week');
            // Hacer day_of_week nullable porque no se usará si es clase única
            $table->string('day_of_week')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('class_schedules', function (Blueprint $table) {
            $table->dropColumn(['is_recurring', 'specific_date']);
        });
    }
};
