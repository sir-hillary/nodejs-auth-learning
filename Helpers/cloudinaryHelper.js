const cloudinary = require('../Config/cloudinary');


const uploadToCloudinary = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath)

        return{
            url: result.url,
            publicId: result.public_id
        }

    } catch (error) {
        console.error('Error while uploading to cloudinary', error)
        throw new Error('Error while uploading to cloudinary')
    }
}

module.exports = uploadToCloudinary