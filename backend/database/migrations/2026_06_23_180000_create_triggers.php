<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ═══════════════════════════════════════════════════════════════
        // TRIGGER 1: Auto-expirar suscripciones vencidas
        // Se ejecuta ANTES de consultar una suscripción.
        // Si la fecha actual supera end_date, cambia status a 'expired'.
        // ═══════════════════════════════════════════════════════════════
        DB::unprepared('
            CREATE TRIGGER trg_auto_expire_subscription
            BEFORE UPDATE ON subscriptions
            FOR EACH ROW
            BEGIN
                IF NEW.status = "active"
                   AND NEW.end_date IS NOT NULL
                   AND NEW.end_date < CURDATE()
                THEN
                    SET NEW.status = "expired";
                END IF;
            END
        ');

        // ═══════════════════════════════════════════════════════════════
        // TRIGGER 2: Descontar créditos al registrar asistencia
        // Cuando se inserta una nueva asistencia, busca la suscripción
        // activa del usuario. Si es de tipo 'credit_based', le resta 1
        // crédito. Si llega a 0, la marca como 'expired'.
        // ═══════════════════════════════════════════════════════════════
        DB::unprepared('
            CREATE TRIGGER trg_deduct_credit_on_attendance
            AFTER INSERT ON attendances
            FOR EACH ROW
            BEGIN
                DECLARE v_sub_id INT;
                DECLARE v_credits INT;
                DECLARE v_type VARCHAR(20);

                SELECT s.id, s.remaining_credits, m.type
                INTO v_sub_id, v_credits, v_type
                FROM subscriptions s
                INNER JOIN memberships m ON s.membership_id = m.id
                WHERE s.user_id = NEW.user_id
                  AND s.status = "active"
                ORDER BY s.created_at DESC
                LIMIT 1;

                IF v_type = "credit_based" AND v_credits IS NOT NULL THEN
                    UPDATE subscriptions
                    SET remaining_credits = remaining_credits - 1
                    WHERE id = v_sub_id;

                    IF v_credits - 1 <= 0 THEN
                        UPDATE subscriptions
                        SET status = "expired"
                        WHERE id = v_sub_id;
                    END IF;
                END IF;
            END
        ');

        // ═══════════════════════════════════════════════════════════════
        // TRIGGER 3: Log de auditoría al modificar un pago
        // Registra en una tabla de auditoría cada vez que se actualiza
        // el monto de un pago (prevención de fraude).
        // ═══════════════════════════════════════════════════════════════
        DB::unprepared('
            CREATE TABLE IF NOT EXISTS payment_audit_log (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                payment_id BIGINT UNSIGNED NOT NULL,
                old_amount DECIMAL(10,2),
                new_amount DECIMAL(10,2),
                changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ');

        DB::unprepared('
            CREATE TRIGGER trg_audit_payment_update
            AFTER UPDATE ON payments
            FOR EACH ROW
            BEGIN
                IF OLD.amount <> NEW.amount THEN
                    INSERT INTO payment_audit_log (payment_id, old_amount, new_amount, changed_at)
                    VALUES (NEW.id, OLD.amount, NEW.amount, NOW());
                END IF;
            END
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_auto_expire_subscription');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_deduct_credit_on_attendance');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_audit_payment_update');
        DB::unprepared('DROP TABLE IF EXISTS payment_audit_log');
    }
};
