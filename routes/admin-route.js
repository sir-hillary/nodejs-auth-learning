const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middlware')


router.get('/welcome', authMiddleware, isAdminUser, (req, res)=>{
    res.status(200).json({
        message: 'welcome to the admin panel'
    })
})





module.exports = router;