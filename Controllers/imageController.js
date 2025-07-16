const Image = require("../models/Image");
const uploadToCloudinary = require("../Helpers/cloudinaryHelper");
const { url } = require("../Config/cloudinary");
const fs = require("fs");
const cloudinary = require('../Config/cloudinary');

const uploadImageController = async (req, res) => {
  try {
    //checking if the file is missing in req object
    if (!req.file) {
      return res.status(404).json({
        success: false,
        message: "File is required. Please upload an image!",
      });
    }

    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the url and public id along with the user id in the mongoDB database
    const newlyUploadedImage = await Image.create({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully!",
      image: newlyUploadedImage,
    });

    //deleting the file from the local storage
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "unsuccessful image upload!",
    });
  }
};

const fetchImageController = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages/limit)

    const sortObj = {
    }
    sortObj[sortBy] = sortOrder

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "could not fetch the images! please try again!",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    //getting the image id
    const deleteImageId = req.params.id;

    //getting the user id
    const adminDelId = req.userInfo.userId;

    const currentImage = await Image.findById(deleteImageId);

    if (!currentImage) {
      return res.status(404).json({
        success: false,
        message: 'Image to be deleted not found!'
      });
    };

    //check if this image was uploaded by the current user who is trying to delete this image

    if(currentImage.uploadedBy.toString() !== adminDelId){
        return res.status(403).json({
            success: false,
            message: 'You are not authorized to delete the image!'
        })
    }

    //delete from cloudinary storage
    await cloudinary.uploader.destroy(currentImage.publicId);

    //deleting the image from mongoDB database

    await Image.findByIdAndUpdate(deleteImageId);


    res.status(200).json({
        success: true,
        message: 'Image deleted successfully!'
    })



  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong! please try again later",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController,
};
