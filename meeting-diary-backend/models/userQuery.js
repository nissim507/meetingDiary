const pool = require('../config/db');

exports.getAllUsers = async () => {
    const res = await pool.query('SELECT user_id, username, email FROM users');
    return res.rows;
};

exports.getNameAndLastUsers = async () => {
    const res = await pool.query('SELECT user_id, name, last_name FROM users');
    return res.rows;
};

exports.getUsersByUsername = async (username) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE username ILIKE $1', [`%${username}%`]
    );

    return result.rows;
};

exports.getUserByUsername = async (username) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1', [username]
    );

    return result.rows[0] || null;
};

exports.getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return result.rows[0] || null;
};

exports.createUser = async (user) => {
    const result = await pool.query(`INSERT INTO users (username, password, name, last_name, email) 
                                     VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
                                     [user.username, user.password, user.name, user.last_name, user.email]);
    return result.rows[0];
};

exports.updateUser = async (user) => {
    const result = await pool.query(
        `UPDATE users SET
            password = COALESCE($1, password),
            name = COALESCE($2,  name),
            last_name = COALESCE($3, last_name)
            WHERE user_id = $4 RETURNING *`,
        [user.password, user.name, user.last_name, user.user_id]
    );

    return result.rows[0] ||null;
};

exports.deleteUser = async (id) => {
    const result = await pool.query(`DELETE FROM users WHERE user_id = $1 RETURNING *`, [id]);
    return result.rows[0] || null;
};

exports.getAllUsersWithNames = async () => {
  const res = await pool.query(
    `SELECT user_id, name, last_name, username, email
     FROM users`
  );
  return res.rows;
};