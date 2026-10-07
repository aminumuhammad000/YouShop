const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '..', '..', 'uploads', 'profiles');
fs.mkdirSync(uploadDirectory, { recursive: true });

const productUploadDirectory = path.join(__dirname, '..', '..', 'uploads', 'products');
fs.mkdirSync(productUploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
    callback(null, `${req.user._id}-${Date.now()}${extension}`);
  },
});

const imageOnly = (_req, file, callback) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    return callback(null, true);
  }
  return callback(new Error('Only image files are allowed'));
};

const profilePictureUpload = multer({
  storage,
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const productStorage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, productUploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
    callback(null, `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`);
  },
});

const productImageUpload = multer({
  storage: productStorage,
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
});

module.exports = { profilePictureUpload, productImageUpload, uploadDirectory };
