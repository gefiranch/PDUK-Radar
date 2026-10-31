-- OPTIONAL testing accounts. Run after 001_setup.sql.
-- admin@gmail.com / admin123 and user@gmail.com / user123
-- Existing accounts/passwords are never overwritten. Change passwords after first login.
BEGIN;
INSERT INTO public.app_users(id,email,name,role,status,password_hash,created_by,created_at,updated_at)
VALUES
 ('initial-admin','admin@gmail.com','Administrator','admin','active','pbkdf2-sha256$100000$1H6E+ETG1YaMC44B9NVURw==$i0XLQHSdRIVThW6+4UKJewkcHcy6BUbjzdQBteGsMZk=','sql-setup',now()::text,now()::text),
 ('initial-user','user@gmail.com','Pengguna','user','active','pbkdf2-sha256$100000$V4CanYJJ+O797vWylwp8OA==$hWOhZSoGHfTDRcM3McRYvLtyTnxM0S2RzsEIBPdrNY8=','sql-setup',now()::text,now()::text)
ON CONFLICT DO NOTHING;
COMMIT;
