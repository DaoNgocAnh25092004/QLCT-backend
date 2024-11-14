const cloudinary = require('../configs/cloudinary');

class ImagesController {
    // [Post] /images
    async uploadImages(req, res, next) {
        try {
            const images = res.files.map((file) => file.path);

            const uploadImages = [];

            for (const image of images) {
                const result = await cloudinary.upload.upload(image);
                console.log('🚀 ~ ImagesController ~ uploadImage ~ result:', result);
                uploadImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }

            return res.status(200).json({
                message: 'Upload images successfully',
                data: uploadImages,
            });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new ImagesController();
