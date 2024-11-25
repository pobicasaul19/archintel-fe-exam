const express = require('express');
const { login } = require('../../../controller/authController.cjs');
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Login user and generate bearer token.
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
 *         name: password
 *         description: Password
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
const router = express.Router();
router.post('/', login);
module.exports = router;
