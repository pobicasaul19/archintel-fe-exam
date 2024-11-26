const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loadUserCollection } = require('../config/db');

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, 'archintel_dev', { expiresIn: '30m' });
};

// Register user
const register = async (req, res) => {
  try {
    const usersCollection = await loadUserCollection();
    // const { firstName, lastName, type, status, password } = req.body;
    const firstName = req.query.firstName || req.body.firstName;
    const lastName = req.query.lastName || req.body.lastName;
    const type = req.query.type || req.body.type;
    const status = req.query.status || req.body.status;
    const password = req.query.password || req.body.password

    // Validate input
    if (!firstName || !lastName || !type || !status) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const userExist = await usersCollection.findOne({
      $or: [{ firstName }, { lastName }],
    });
    if (userExist) {
      return res.status(409).json({ message: 'User details already exist.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const counter = await usersCollection.countDocuments();
    const newUser = {
      id: counter + 1,
      firstName,
      lastName,
      type,
      status,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);
    // await passwordsCollection.insertOne({ userId, hashedPassword });

    const accessToken = generateAccessToken(userId);
    res.status(201).json({
      data: { user: { ...newUser }, token: accessToken },
      metadata: { message: 'User created successfully.' },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const usersCollection = await loadUserCollection();
    const firstName = req.query.firstName || req.body.firstName;
    const password = req.query.password || req.body.password
    // Validate input
    if (!firstName || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const user = await usersCollection.findOne({ firstName });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const userPasswordRecord = await usersCollection.findOne({ userId: user._id });
    if (!userPasswordRecord) {
      return res.status(404).json({ message: 'Password record not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, userPasswordRecord.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const accessToken = generateAccessToken(user._id);
    res.status(200).json({
      data: { user, token: accessToken },
      metadata: { message: 'Login successful.' },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
