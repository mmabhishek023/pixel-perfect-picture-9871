-- BCrypt hash for Password@123 with work factor 10
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh23

INSERT INTO users (name, email, password_hash, role, status) VALUES
('Alice Owner','owner@example.org','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh23','OWNER','ACTIVE'),
('Bob Tech','tech@example.org','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh23','TECHNICIAN','ACTIVE'),
('Pending Tech','pendingtech@example.org','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh23','TECHNICIAN','PENDING'),
('Victor Viewer','viewer@example.org','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh23','VIEWER','ACTIVE'),
('Ava Admin','admin@example.org','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh23','ADMIN','ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- ExampleBook 14: 4 years old -> Score 51 / Grade C / REPAIR
-- dAge=min(30,5*4)=20, dRep=min(20,4*2)=8, dBat=min(20,0.5*(80-62))=9,
-- dCmp=min(20,5*1+2*1)=7(POOR battery, FAIR port), dCrit=min(10,5*1)=5(REPLACED display) -> total=49, score=51
INSERT INTO devices (passport_id, owner_id, device_type, brand, model, serial_imei, purchase_date, os_name, ram_gb, storage_gb, processor, status, qr_token)
SELECT 'RTP-2026-000123', u.user_id, 'LAPTOP', 'Example', 'ExampleBook 14', 'SN1234567890',
       (CURRENT_DATE - INTERVAL '4 years')::DATE,
       'Ubuntu 22.04', 16, 512, 'Intel Core i7-12th Gen', 'IN_USE', 'Xk3u9QmZc0Wb5T1hYpL2aA'
FROM users u WHERE u.email = 'owner@example.org'
ON CONFLICT (passport_id) DO NOTHING;

INSERT INTO components (device_id, component_type, condition, battery_health, origin, installed_on)
SELECT d.device_id, 'BATTERY', 'POOR', 62, 'ORIGINAL', (CURRENT_DATE - INTERVAL '4 years')::DATE
FROM devices d WHERE d.passport_id = 'RTP-2026-000123';

INSERT INTO components (device_id, component_type, condition, origin, installed_on)
SELECT d.device_id, 'PORT', 'FAIR', 'ORIGINAL', (CURRENT_DATE - INTERVAL '4 years')::DATE
FROM devices d WHERE d.passport_id = 'RTP-2026-000123';

INSERT INTO components (device_id, component_type, condition, origin, installed_on, ended_on, is_active)
SELECT d.device_id, 'DISPLAY', 'POOR', 'ORIGINAL',
       (CURRENT_DATE - INTERVAL '4 years')::DATE,
       (CURRENT_DATE - INTERVAL '2 years')::DATE, FALSE
FROM devices d WHERE d.passport_id = 'RTP-2026-000123';

INSERT INTO components (device_id, component_type, condition, origin, installed_on, is_active)
SELECT d.device_id, 'DISPLAY', 'GOOD', 'REPLACED',
       (CURRENT_DATE - INTERVAL '2 years')::DATE, TRUE
FROM devices d WHERE d.passport_id = 'RTP-2026-000123';

INSERT INTO repair_records (device_id, technician_id, repair_date, issue, action_taken, cost, verified, notes)
SELECT d.device_id, u.user_id,
       (CURRENT_DATE - INTERVAL '2 years')::DATE,
       'Display cracked after drop', 'Replaced display panel with OEM part', 4500.00, TRUE,
       'Verified repair by certified technician'
FROM devices d, users u WHERE d.passport_id = 'RTP-2026-000123' AND u.email = 'tech@example.org';

INSERT INTO repair_records (device_id, technician_id, repair_date, issue, action_taken, cost, verified, notes)
SELECT d.device_id, u.user_id,
       (CURRENT_DATE - INTERVAL '1 year')::DATE,
       'Battery draining fast', 'Battery checked, still above threshold but degraded', 500.00, TRUE,
       'Battery at 62%, advised replacement'
FROM devices d, users u WHERE d.passport_id = 'RTP-2026-000123' AND u.email = 'tech@example.org';

INSERT INTO health_assessments (device_id, score, grade, factors, recommendation, reasons)
SELECT d.device_id, 51, 'C',
       '{"dAge":20,"dRep":8,"dBat":9,"dCmp":7,"dCrit":5}'::jsonb,
       'REPAIR',
       '["Battery at 62% health (POOR) - 9pt deduction","Device age 4 years - 20pt deduction","2 historical repairs - 8pt deduction"]'::jsonb
FROM devices d WHERE d.passport_id = 'RTP-2026-000123';

INSERT INTO devices (passport_id, owner_id, device_type, brand, model, serial_imei, purchase_date, os_name, ram_gb, storage_gb, processor, status, qr_token)
SELECT 'RTP-2026-000200', u.user_id, 'SMARTPHONE', 'Samsung', 'Galaxy S22', 'IMEI9876543210',
       (CURRENT_DATE - INTERVAL '2 years')::DATE,
       'Android 14', 8, 128, 'Snapdragon 8 Gen 1', 'REGISTERED', 'QrTok2000SamsungGalaxyS22X'
FROM users u WHERE u.email = 'owner@example.org'
ON CONFLICT (passport_id) DO NOTHING;

INSERT INTO devices (passport_id, owner_id, device_type, brand, model, serial_imei, purchase_date, os_name, ram_gb, storage_gb, processor, status, qr_token)
SELECT 'RTP-2026-000300', u.user_id, 'LAPTOP', 'Apple', 'MacBook Pro 14', 'MBPSN001122',
       (CURRENT_DATE - INTERVAL '1 year')::DATE,
       'macOS Sonoma', 16, 512, 'Apple M3 Pro', 'IN_USE', 'QrTok3000AppleMacBookPro14X'
FROM users u WHERE u.email = 'owner@example.org'
ON CONFLICT (passport_id) DO NOTHING;

INSERT INTO devices (passport_id, owner_id, device_type, brand, model, serial_imei, purchase_date, os_name, ram_gb, storage_gb, processor, status, qr_token)
SELECT 'RTP-2024-000400', u.user_id, 'SMARTPHONE', 'Google', 'Pixel 7a', 'PIXSN99887766',
       (CURRENT_DATE - INTERVAL '5 years')::DATE,
       'Android 13', 8, 128, 'Google Tensor G2', 'UNDER_REPAIR', 'QrTok4000GooglePixel7aXYZ'
FROM users u WHERE u.email = 'owner@example.org'
ON CONFLICT (passport_id) DO NOTHING;

INSERT INTO devices (passport_id, owner_id, device_type, brand, model, serial_imei, purchase_date, os_name, ram_gb, storage_gb, processor, status, qr_token)
SELECT 'RTP-2022-000500', u.user_id, 'LAPTOP', 'Dell', 'XPS 15', 'DELLXPSSN55443',
       (CURRENT_DATE - INTERVAL '7 years')::DATE,
       'Windows 11', 16, 1000, 'Intel Core i7-10th Gen', 'FOR_SALE', 'QrTok5000DellXPS15ABCDE'
FROM users u WHERE u.email = 'owner@example.org'
ON CONFLICT (passport_id) DO NOTHING;