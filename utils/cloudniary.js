const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const CloudnairyUploadImage = (filetoUploads, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filetoUploads,
            {
                folder: folder,  // Specify the folder to save the images in
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    console.error('Upload Error:', error);
                    return reject(error);
                }
                resolve({
                    url: result.secure_url,
                });
            }
        );
    });
};


module.exports = CloudnairyUploadImage