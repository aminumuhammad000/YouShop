const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { productImageUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', productImageUpload.array('images', 3), createProduct);
router.put('/:id', productImageUpload.array('images', 3), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
