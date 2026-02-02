const pool = require('../models/userQuery')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

exports.getUsersByUsername = async (username) => {
  if (!username) 
  {
    return await pool.getAllUsers();
  }

  return await pool.getUserByUsername(username);
  
};

exports.getAllUsers = async () => {
    return await pool.getNameAndLastUsers();
};

exports.addUser = async (userData) => {
  if(!userData.username || !userData.email || !userData.password) 
  {
    throw new Error('Missing user data');
  }

  const exists = await pool.getUserByUsername(userData.username);
  if (exists) 
  {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  return await pool.createUser(userData);
};

exports.updateUser = async (userToUpdate) => {
  console.log("userToUpdate in control:", userToUpdate);
  if(!userToUpdate.user_id) {
    throw new Error('User ID is required');
  }

  const exist = await pool.getUserById(userToUpdate.user_id);
  if(!exist) {
    throw new Error('User not found');
  }
  
  return await pool.updateUser(userToUpdate);
};

exports.getUserById = async (id) => {
  if(!id) {
    throw new Error('User ID is required');
  }

  return await pool.getUserById(id);
};

exports.loginUser = async (username, password) => {
  if(!username || !password) 
  {
    throw new Error('Username and password are required');
  }

  const user = await pool.getUserByUsername(username);
  if(!user) 
  {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);
  if(!valid)
  {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({
      id: user.user_id, 
      username: user.username
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN 
    });

  return {
    token,
    user,
  };
};

exports.deleteUser = async (userId) => {
    const exists = await pool.getUserById(userId);
    if (!exists) return null;

    return await pool.deleteUser(userId);
};
