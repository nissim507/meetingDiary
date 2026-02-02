
const pool = require('../config/db');

exports.getAllMeetings = async () => {
  const res = await pool.query('SELECT * FROM meetings ORDER BY date, time');
  return res.rows;
};

exports.getMeetingsByUserId = async (userId) => {
  const res = await pool.query(
    `SELECT * FROM meetings 
     WHERE owner_user = $1 
     OR meeting_id IN (
       SELECT meeting_id FROM participants WHERE user_id = $1
     )
     ORDER BY date, time`,
    [userId]
  );
  
  return res.rows;
};

exports.getMeetingById = async (id) => {
  const res = await pool.query('SELECT * FROM meetings WHERE meeting_id = $1', [id]);
  return res.rows[0] || null;
};

exports.insertMeeting = async (meeting) => {
  const result = await pool.query(
    `INSERT INTO meetings (title, date, time, end_time, place, owner_user, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [meeting.title, meeting.date, meeting.time, meeting.end_time, meeting.place, meeting.owner_user, meeting.notes]
);
return result.rows[0];
};

exports.updateMeeting = async (meeting) => {
  const res = await pool.query(
    `UPDATE meetings SET title=$7, date=$1, time=$2, end_time=$3, place=$4, notes=$5
     WHERE meeting_id=$6 RETURNING *`,
    [meeting.date, meeting.time, meeting.end_time, meeting.place, meeting.notes, meeting.meeting_id, meeting.title]
  );
  return res.rows[0] || null;
};

exports.deleteMeeting = async (id) => {
  const res = await pool.query(
    'DELETE FROM meetings WHERE meeting_id=$1 RETURNING *',
    [id]
  );
  return res.rows[0] || null;
};

exports.getMeetingsByUserIdAndDate = async (userId, date) => {
  const res = await pool.query(
    `SELECT m.*
     FROM meetings m
     JOIN participants p ON m.meeting_id = p.meeting_id
     WHERE p.user_id = $1
       AND m.date >= $2::date
       AND m.date < ($2::date + INTERVAL '1 day')`,
    [userId, date]
  );
  return res.rows;
};
