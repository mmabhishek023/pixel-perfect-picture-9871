CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER','TECHNICIAN','VIEWER','ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','PENDING','BLOCKED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devices (
    device_id BIGSERIAL PRIMARY KEY,
    passport_id VARCHAR(20) NOT NULL UNIQUE,
    owner_id BIGINT NOT NULL REFERENCES users(user_id),
    device_type VARCHAR(15) NOT NULL CHECK (device_type IN ('SMARTPHONE','LAPTOP')),
    brand VARCHAR(60) NOT NULL,
    model VARCHAR(60) NOT NULL,
    serial_imei VARCHAR(40) NOT NULL UNIQUE,
    purchase_date DATE NOT NULL,
    os_name VARCHAR(40),
    ram_gb INTEGER,
    storage_gb INTEGER,
    processor VARCHAR(60),
    status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED','IN_USE','UNDER_REPAIR','FOR_SALE','REFURBISHING','RECYCLED')),
    previous_owners_count INTEGER NOT NULL DEFAULT 0,
    known_damages TEXT,
    damage_notes TEXT,
    prior_history TEXT,
    internal_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_INSPECTION',
    payout_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_INSPECTION',
    payout_amount NUMERIC(10,2),
    owner_photos TEXT,
    listing_photos TEXT,
    active_damages TEXT,
    resolved_damages TEXT,
    is_listed_for_sale BOOLEAN NOT NULL DEFAULT FALSE,
    listing_price NUMERIC(10,2),
    listing_condition VARCHAR(60),
    listing_notes TEXT,
    qr_token VARCHAR(64) NOT NULL UNIQUE,
    qr_image_path VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS components (
    component_id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices(device_id),
    component_type VARCHAR(30) NOT NULL CHECK (component_type IN ('BATTERY','RAM','SSD','DISPLAY','MOTHERBOARD','CAMERA','PORT','OTHER')),
    brand_model VARCHAR(80),
    capacity_spec VARCHAR(60),
    installed_on DATE NOT NULL DEFAULT CURRENT_DATE,
    ended_on DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    origin VARCHAR(10) NOT NULL DEFAULT 'ORIGINAL' CHECK (origin IN ('ORIGINAL','REPLACED')),
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('GOOD','FAIR','POOR')),
    battery_health SMALLINT CHECK (battery_health BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS repair_records (
    repair_id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices(device_id),
    technician_id BIGINT REFERENCES users(user_id),
    repair_date DATE NOT NULL,
    issue TEXT,
    action_taken TEXT,
    cost NUMERIC(10,2),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_repair_device_date ON repair_records(device_id, repair_date);

CREATE TABLE IF NOT EXISTS repair_amendments (
    amendment_id BIGSERIAL PRIMARY KEY,
    repair_id BIGINT NOT NULL REFERENCES repair_records(repair_id),
    author_id BIGINT NOT NULL REFERENCES users(user_id),
    note TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS repair_components (
    repair_id BIGINT NOT NULL REFERENCES repair_records(repair_id),
    component_id BIGINT NOT NULL REFERENCES components(component_id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('REPLACED','REPAIRED','CLEANED')),
    PRIMARY KEY (repair_id, component_id)
);

CREATE TABLE IF NOT EXISTS health_assessments (
    assessment_id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices(device_id),
    score SMALLINT NOT NULL,
    grade CHAR(1) NOT NULL,
    factors JSONB,
    recommendation VARCHAR(20),
    reasons JSONB,
    generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_uploads (
    image_id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices(device_id),
    component_id BIGINT REFERENCES components(component_id),
    file_path VARCHAR(255) NOT NULL,
    ai_label VARCHAR(50),
    confidence NUMERIC(5,3),
    confirmed_by_user BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    entity VARCHAR(40) NOT NULL,
    entity_id BIGINT NOT NULL,
    change_summary TEXT,
    changed_by BIGINT REFERENCES users(user_id),
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);