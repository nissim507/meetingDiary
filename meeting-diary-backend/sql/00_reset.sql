-- Meeting Diary Database Reset Script
-- WARNING: This script will DROP all tables and data!
-- Use with caution. This is useful for development/testing.
-- 
-- Usage: psql -U postgres -d meeting_diary -f 00_reset.sql

-- Drop tables in reverse order of dependencies to avoid foreign key constraint errors
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Note: After running this script, run 01_schema.sql to recreate the tables

