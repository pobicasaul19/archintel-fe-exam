const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loadUserCollection } = require('../config/db');

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, 'archintel_test_asssesment', { expiresIn: '30m' });
};

// Register user
const register = async (req, res) => {
  try {
    const usersCollection = await loadUserCollection();
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
      userName: `${firstName}${lastName}`.toLowerCase(),
      type,
      status,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({
      data: { user: { ...newUser } },
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
    const userName = req.query.userName || req.body.userName;
    const password = req.query.password || req.body.password;

    // Validate input
    if (!userName || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }
    // Find user by userName
    const user = await usersCollection.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Generate token
    const accessToken = generateAccessToken(user._id);
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      data: { user: userWithoutPassword, token: accessToken },
      metadata: { message: 'Authorized' },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { register, login };
