/**
 * Generate Seed Data Script
 * 
 * This Node.js script generates proper bcrypt hashes and inserts seed data.
 * Run this after running 01_schema.sql
 * 
 * Usage: node sql/03_generate_seed.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const TEST_PASSWORD = 'password123';

async function generateSeedData() {
  try {
    console.log('Generating seed data...\n');

    // Generate bcrypt hash for test password
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
    console.log(`✓ Generated bcrypt hash for password: ${TEST_PASSWORD}`);

    // Insert test users
    const users = [
      { username: 'admin', name: 'Admin', last_name: 'User', email: 'admin@example.com' },
      { username: 'john.doe', name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
      { username: 'jane.smith', name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' }
    ];

    const userIds = {};

    for (const user of users) {
      const result = await pool.query(
        `INSERT INTO users (username, password, name, last_name, email)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO UPDATE SET
           name = EXCLUDED.name,
           last_name = EXCLUDED.last_name,
           email = EXCLUDED.email
         RETURNING user_id, username`,
        [user.username, hashedPassword, user.name, user.last_name, user.email]
      );
      userIds[user.username] = result.rows[0].user_id;
      console.log(`✓ Created/updated user: ${user.username} (ID: ${result.rows[0].user_id})`);
    }

    // Insert test meetings
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const meetings = [
      {
        title: 'Team Standup',
        date: today,
        time: '09:00:00',
        end_time: '09:30:00',
        place: 'Conference Room A',
        owner: 'admin',
        notes: 'Daily standup meeting'
      },
      {
        title: 'Project Planning',
        date: tomorrow,
        time: '14:00:00',
        end_time: '16:00:00',
        place: 'Virtual Meeting',
        owner: 'john.doe',
        notes: 'Quarterly planning session'
      }
    ];

    const meetingIds = {};

    for (const meeting of meetings) {
      const ownerId = userIds[meeting.owner];
      
      // Check if meeting already exists
      const existing = await pool.query(
        'SELECT meeting_id FROM meetings WHERE title = $1 AND owner_user = $2 AND date = $3',
        [meeting.title, ownerId, meeting.date]
      );

      if (existing.rows.length > 0) {
        meetingIds[meeting.title] = existing.rows[0].meeting_id;
        console.log(`✓ Meeting already exists: ${meeting.title} (ID: ${existing.rows[0].meeting_id})`);
      } else {
        const result = await pool.query(
          `INSERT INTO meetings (title, date, time, end_time, place, owner_user, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING meeting_id, title`,
          [meeting.title, meeting.date, meeting.time, meeting.end_time, meeting.place, ownerId, meeting.notes]
        );
        meetingIds[meeting.title] = result.rows[0].meeting_id;
        console.log(`✓ Created meeting: ${meeting.title} (ID: ${result.rows[0].meeting_id})`);
      }
    }

    // Insert participants
    if (meetingIds['Team Standup']) {
      const participants = ['john.doe', 'jane.smith'];
      for (const username of participants) {
        await pool.query(
          `INSERT INTO participants (meeting_id, user_id, status)
           VALUES ($1, $2, $3)
           ON CONFLICT (meeting_id, user_id) DO UPDATE SET status = EXCLUDED.status`,
          [meetingIds['Team Standup'], userIds[username], 'accepted']
        );
        console.log(`✓ Added participant ${username} to Team Standup`);
      }
    }

    console.log('\n✅ Seed data generation complete!');
    console.log(`\nTest users created with password: ${TEST_PASSWORD}`);
    console.log('You can now log in with any of these usernames:');
    users.forEach(u => console.log(`  - ${u.username}`));

  } catch (error) {
    console.error('❌ Error generating seed data:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
generateSeedData();

