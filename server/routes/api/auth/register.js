const express = require('express');
const { register } = require('../../../controller/authController.cjs');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register
 *     description: Register a new user with the provided details.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: firstName
 *         description: User Firstname
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: lastName
 *         description: User Lastname
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         description: User Type
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         description: User Status
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Bad request
 */

const router = express.Router();

router.post('/', register);

module.exports = router;