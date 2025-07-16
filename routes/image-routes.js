const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middlware');
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageController, fetchImageController, deleteImageController} = require('../Controllers/imageController')


const router = express.Router();

//upload the image

router.post('/upload', authMiddleware, isAdminUser, uploadMiddleware.single('image'), uploadImageController);


//get all the images
router.get('/get',authMiddleware, fetchImageController)


//delete image route

router.delete('/delete/:id', authMiddleware, isAdminUser,deleteImageController)


module.exports = router;