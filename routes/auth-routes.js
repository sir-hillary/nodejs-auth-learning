const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword } = require('../Controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');


//all routes are related to authentication and authorisation

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password',authMiddleware, changePassword);







module.exports = router;