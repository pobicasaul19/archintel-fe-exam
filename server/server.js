const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();

const { verifyToken } = require('./middleware/authMiddleware');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Swagger UI
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerInfo));

// Auth
const login = require('./routes/api/auth/login')
app.use('/api/auth/login', login)
const register = require('./routes/api/auth/register')
app.use('/api/auth/register', register)

// Users
// const users = require('./routes/api/users')
// app.use('/api/users', verifyToken, users)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));