# SQL Scripts for Meeting Diary Database

This folder contains PostgreSQL scripts for setting up and managing the Meeting Diary database.

## Scripts Overview

### `00_reset.sql`
**Purpose:** Drops all tables and data (use with caution!)  
**When to use:** When you need to completely reset the database during development  
**Warning:** This will delete all data!

### `01_schema.sql`
**Purpose:** Creates all database tables, indexes, and constraints  
**When to use:** Initial database setup or when you need to ensure tables exist  
**Idempotent:** Yes - safe to run multiple times

### `02_seed_data.sql`
**Purpose:** SQL-only seed data template (mostly empty - see notes)  
**When to use:** Reference only - use `03_generate_seed.js` instead  
**Idempotent:** Yes

### `03_generate_seed.js`
**Purpose:** Node.js script that generates seed data with proper bcrypt password hashing  
**When to use:** When you need test data for development (RECOMMENDED)  
**Idempotent:** Yes - safe to run multiple times  
**Requirements:** Node.js, npm dependencies installed, `.env` file configured

## Quick Start

### 1. Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE meeting_diary;

# Exit psql
\q
```

### 2. Run the Schema Script

```bash
# Using psql command line
psql -U postgres -d meeting_diary -f meeting-diary-backend/sql/01_schema.sql

# Or if you're already in the sql directory
psql -U postgres -d meeting_diary -f 01_schema.sql
```

### 3. (Optional) Add Seed Data

**Recommended:** Use the Node.js script for proper password hashing:
```bash
cd meeting-diary-backend
node sql/03_generate_seed.js
```

This will create test users with password: `password123` and sample meetings/participants.

**Alternative:** Use SQL script (requires users to be created first via API):
```bash
psql -U postgres -d meeting_diary -f meeting-diary-backend/sql/02_seed_data.sql
```

## Complete Reset (Development Only)

If you need to completely reset the database:

```bash
# 1. Drop and recreate everything
psql -U postgres -d meeting_diary -f meeting-diary-backend/sql/00_reset.sql

# 2. Recreate schema
psql -U postgres -d meeting_diary -f meeting-diary-backend/sql/01_schema.sql

# 3. (Optional) Add seed data
cd meeting-diary-backend
node sql/03_generate_seed.js
```

## Using Connection String

If you're using a connection string in your `.env` file, you can also run scripts like this:

```bash
# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database

# Example with connection string
psql "postgresql://postgres:your_password@localhost:5432/meeting_diary" -f meeting-diary-backend/sql/01_schema.sql
```

## Running Scripts from Node.js

You can also run these scripts programmatically from Node.js:

```javascript
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runScript(filename) {
  const sql = fs.readFileSync(`sql/${filename}`, 'utf8');
  await pool.query(sql);
}

// Run schema script
runScript('01_schema.sql')
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

## Database Schema

### Tables

1. **users**
   - `user_id` (SERIAL PRIMARY KEY)
   - `username` (VARCHAR, UNIQUE)
   - `password` (VARCHAR, hashed with bcrypt)
   - `name` (VARCHAR)
   - `last_name` (VARCHAR)
   - `email` (VARCHAR)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **meetings**
   - `meeting_id` (SERIAL PRIMARY KEY)
   - `title` (VARCHAR)
   - `date` (DATE)
   - `time` (TIME)
   - `end_time` (TIME)
   - `place` (VARCHAR)
   - `owner_user` (INTEGER, FK to users.user_id)
   - `notes` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMP)

3. **participants**
   - `participant_id` (SERIAL PRIMARY KEY)
   - `meeting_id` (INTEGER, FK to meetings.meeting_id)
   - `user_id` (INTEGER, FK to users.user_id)
   - `status` (VARCHAR, default: 'pending')
   - `created_at`, `updated_at` (TIMESTAMP)
   - UNIQUE constraint on (meeting_id, user_id)

### Foreign Key Relationships

- `meetings.owner_user` → `users.user_id` (CASCADE on delete)
- `participants.meeting_id` → `meetings.meeting_id` (CASCADE on delete)
- `participants.user_id` → `users.user_id` (CASCADE on delete)

## Troubleshooting

### "relation already exists" errors
The scripts use `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If it does, you may have manually created tables. Use `00_reset.sql` to clean up.

### Foreign key constraint errors
Make sure to run scripts in order:
1. `01_schema.sql` (creates all tables)
2. `02_seed_data.sql` (inserts data)

### Permission errors
Ensure your PostgreSQL user has CREATE privileges:
```sql
GRANT ALL PRIVILEGES ON DATABASE meeting_diary TO your_user;
```

## Notes

- All scripts are designed to be **idempotent** (safe to run multiple times)
- The seed data script includes placeholder bcrypt hashes - in production, create users through the API
- The `status` field in participants can be: 'pending', 'accepted', 'declined', etc.

