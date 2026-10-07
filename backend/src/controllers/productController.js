const asyncHandler = require('express-async-handler');
const RealProduct = require('../models/Product');
const { MockProduct, MockLog } = require('../models/mockDb');
const supabase = require('../config/supabase');

const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

const mapProduct = (product) => product ? ({
  ...product,
  _id: product.id,
  imageUrl: product.image_url || product.imageUrl || null,
  discountPrice: product.discount_price ?? product.discountPrice,
  vendorId: product.vendor_id || product.vendorId,
  createdAt: product.created_at || product.createdAt,
  updatedAt: product.updated_at || product.updatedAt,
}) : product;

const logAction = async (action, details) => {
  if (global.isMockDB) {
    await MockLog.create({ action, details });
  }
};

const getProductModel = () => {
  return global.isMockDB ? MockProduct : RealProduct;
};

// Helper: extract vendor ID from auth header token
const getVendorId = (req) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return null;
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secret123');
    return decoded.id;
  } catch {
    return null;
  }
};

const getUploadedImageUrls = (req) => (req.files || []).map(file =>
  `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`
);

const getExistingImages = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 3) : [];
  } catch {
    return [];
  }
};

// @desc    Get products (vendor-scoped if token present, else all)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  if (useSupabase) {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json((data || []).map(mapProduct));
  }
  const vendorId = getVendorId(req);
  if (!global.isMockDB && vendorId) {
    const products = await RealProduct.find({ vendorId });
    return res.json(products);
  }
  const products = await getProductModel().find({});
  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  if (useSupabase) {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (error) throw error;
    if (!data) {
      res.status(404);
      throw new Error('Product not found');
    }
    return res.json(mapProduct(data));
  }
  const product = await getProductModel().findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const vendorId = getVendorId(req);
  const { name, description, price, discountPrice, stock, sku, category } = req.body;
  if (!name || price === undefined) {
    res.status(400);
    throw new Error('Product name and price are required');
  }
  const images = getUploadedImageUrls(req).slice(0, 3);
  if (useSupabase) {
    const productId = `product-${Date.now().toString(36)}`;
    const { data, error } = await supabase.from('products').insert({
      id: productId,
      name,
      description,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : null,
      stock: stock ? Number(stock) : 0,
      sku,
      category,
      images,
      image_url: images[0] || null,
      vendor_id: vendorId || null,
    }).select('*').single();
    if (error) throw error;
    await logAction('CREATE_PRODUCT', `Created product: ${name}`);
    return res.status(201).json(mapProduct(data));
  }
  const product = await getProductModel().create({
    name, description, price, discountPrice, stock, sku, category,
    images,
    imageUrl: images[0] || undefined,
    vendorId: vendorId || undefined,
  });
  await logAction('CREATE_PRODUCT', `Created product: ${name}`);
  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.existingImages;
  const uploadedImages = getUploadedImageUrls(req);
  const existingImages = getExistingImages(req.body.existingImages);
  if (uploadedImages.length || existingImages.length) {
    updates.images = [...existingImages, ...uploadedImages].slice(0, 3);
    updates.imageUrl = updates.images[0] || undefined;
  }
  if (useSupabase) {
    const supabaseUpdates = {};
    const fieldMap = {
      name: 'name', description: 'description', price: 'price', stock: 'stock', sku: 'sku', category: 'category',
      discountPrice: 'discount_price',
    };
    Object.keys(fieldMap).forEach(field => {
      if (updates[field] !== undefined) supabaseUpdates[fieldMap[field]] = field === 'price' || field === 'stock' || field === 'discountPrice' ? Number(updates[field]) : updates[field];
    });
    if (updates.images) {
      supabaseUpdates.images = updates.images;
      supabaseUpdates.image_url = updates.images[0] || null;
    }
    const { data, error } = await supabase.from('products').update(supabaseUpdates).eq('id', req.params.id).select('*').maybeSingle();
    if (error) throw error;
    if (!data) {
      res.status(404);
      throw new Error('Product not found');
    }
    await logAction('UPDATE_PRODUCT', `Updated product: ${data.name}`);
    return res.json(mapProduct(data));
  }
  const product = await getProductModel().findByIdAndUpdate(req.params.id, updates, { new: true });
  if (product) {
    await logAction('UPDATE_PRODUCT', `Updated product: ${product.name}`);
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  if (useSupabase) {
    const { data, error } = await supabase.from('products').delete().eq('id', req.params.id).select('*').maybeSingle();
    if (error) throw error;
    if (!data) {
      res.status(404);
      throw new Error('Product not found');
    }
    await logAction('DELETE_PRODUCT', `Deleted product: ${data.name}`);
    return res.json({ message: 'Product removed' });
  }
  const product = await getProductModel().findByIdAndDelete(req.params.id);
  if (product) {
    await logAction('DELETE_PRODUCT', `Deleted product: ${product.name}`);
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
