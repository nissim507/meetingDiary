
const pool = require('../config/db');

exports.getParticipantsByMeetingId = async (meetingId) => {
  const res = await pool.query(
    `SELECT p.participant_id, p.user_id, u.name, u.last_name, u.email, p.status
     FROM participants p
     JOIN users u ON p.user_id = u.user_id
     WHERE p.meeting_id = $1`,
    [meetingId]
  );
  return res.rows;
};

exports.addParticipant = async (meetingId, userId) => {
  const res = await pool.query(
    `INSERT INTO participants (meeting_id, user_id) VALUES ($1, $2)
    ON CONFLICT (meeting_id, user_id) DO NOTHING
    RETURNING *`,
    [meetingId, userId]
  );
  return res.rows[0] || null;
};

exports.updateParticipantStatus = async (meetingId, userId, status) => {
  const res = await pool.query(
    `UPDATE participants SET status=$1 WHERE meeting_id=$2 AND user_id=$3 RETURNING *`,
    [status, meetingId, userId]
  );
  return res.rows[0] || null;
};

exports.deleteParticipant = async (meetingId, userId) => {
  const res = await pool.query(
    `DELETE FROM participants WHERE meeting_id=$1 AND user_id=$2 RETURNING *`,
    [meetingId, userId]
  );
  return res.rows[0] || null;
};

exports.getUsersNotInMeeting = async (meetingId) => {
  const res = await pool.query(
    `SELECT u.user_id, u.name, u.last_name, u.email
     FROM users u
     WHERE u.user_id NOT IN (
       SELECT p.user_id
       FROM participants p
       WHERE p.meeting_id = $1
     )
     ORDER BY u.name, u.last_name`,
    [meetingId]
  );
  return res.rows;
};
