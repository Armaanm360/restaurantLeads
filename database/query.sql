ALTER TABLE prop.property_reservations
ADD COLUMN created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS dbo.email_otp
(
    id serial PRIMARY KEY,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hashed_otp varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    tried integer DEFAULT 0,
    type dbo.type_email_otp NOT NULL,
    matched boolean DEFAULT false
);


CREATE TYPE dbo.type_email_otp AS ENUM
('reset_agent', 'reset_admin', 'verify_user', 'reset_user', 'forget_agent', 'forget_admin', 'forget_user');
