const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loadCollection, saveDatabase } = require('../config/db.js');

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id }, 'archintel_dev', { expiresIn: '30m' });
};

// Register user
const register = async (req, res) => {
  try {
    const users = await loadCollection('users');
    const passwords = await loadCollection('users-password');
    const { firstName, lastName, type, status , password} = req.body;

    if (!firstName || !lastName || !type || !status) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    };

    const userExist = users.find((user) => user.firstName === firstName || user.lastName === lastName);
    if (userExist) {
      return res,status(401).json({ message: 'User details already exist.' });
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now();
    const newUser = {
      id: userId,
      firstName,
      lastName,
      type,
      status,
    };

    users.push(newUser);
    passwords.push({ userId, hashedPassword });
    await saveDatabase();

    const accesToken = generateAccessToken(newUser.id);
    const { ...userInfo } = newUser;
    res.json({
      data: { user: userInfo, token: accesToken },
      metadata: { message: 'User created successfully.'}
    })


  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const users = await loadCollection('users');
    const passwords = await loadCollection('passwords');
    const { firstName, password } = req.body;

    if (!firstName || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const user = users.find((user) => user.firstName === firstName);
    if (!user) {
      return res.status(401).json({ message: 'User does not exist.' });
    }

    const userPasswordRecord = passwords.find((entry) => entry.id === user.id);
    if (!userPasswordRecord) {
      return res.status(401).json({ message: 'Password record not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, userPasswordRecord.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const accessToken = generateAccessToken(user.id);
    res.json({
      data: { user, token: accessToken },
      metadata: { message: 'Login successful.' },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };