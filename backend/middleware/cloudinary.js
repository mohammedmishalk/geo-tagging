const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'dvekmmxxx',
  api_key: '599266113875923',
  api_secret: '8PSGsrCJc7myQNE_SJ700hA-yPk',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'geo-tagging',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    format: async (req, file) => 'jpg', 
    validate: (req, file) => {
     
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('Invalid file type. Only image files are allowed.');
      }
      return true;
    },
  },
});

const upload = multer({ storage });

module.exports = {
  cloudinary,
  storage,
  upload,
};
