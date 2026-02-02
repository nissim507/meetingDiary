-- Meeting Diary Database Schema
-- This script creates all necessary tables, indexes, and constraints.
-- It is idempotent and can be run multiple times safely.

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- MEETINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meetings (
    meeting_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    end_time TIME,
    place VARCHAR(255),
    owner_user INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_meetings_owner_user 
        FOREIGN KEY (owner_user) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meetings_owner_user ON meetings(owner_user);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_date_time ON meetings(date, time);

-- ============================================
-- PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS participants (
    participant_id SERIAL PRIMARY KEY,
    meeting_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_participants_meeting 
        FOREIGN KEY (meeting_id) 
        REFERENCES meetings(meeting_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_participants_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE,
    CONSTRAINT uq_participants_meeting_user 
        UNIQUE (meeting_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_participants_meeting_id ON participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE meetings IS 'Stores meeting information';
COMMENT ON TABLE participants IS 'Stores meeting participants and their status';

COMMENT ON COLUMN participants.status IS 'Participant status: pending, accepted, declined, etc.';

