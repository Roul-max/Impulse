import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { Product } from '../models/Product';
import redis from '../config/redis';
import mongoose from 'mongoose';

// Helper: Convert Decimal128 safely
const convertDecimalFields = (product: any) => {
  const convertValue = (value: any) => {
    if (!value) return value;

    // Case 1: Lean returns BSON Decimal128
    if (value._bsontype === 'Decimal128') {
      return parseFloat(value.toString());
    }

    // Case 2: Mongo raw JSON format
    if (value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }

    return value;
  };

  return {
    ...product,
    price: convertValue(product.price),
    discountedPrice: convertValue(product.discountedPrice),
    variants: product.variants?.map((variant: any) => ({
      ...variant,
      additionalPrice: convertValue(variant.additionalPrice),
    })),
  };
};

// @desc    Fetch all products with caching
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.pageNumber) || 1;

  const cacheKey = `products_v2_${JSON.stringify(req.query)}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
  } catch (err) {
    console.error('[Redis] Cache get error', err);
  }

  // Search
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const filterConfig: any = {
    ...keyword,
    isActive: true,
  };

  if (req.query.category && mongoose.isValidObjectId(req.query.category as string)) {
    filterConfig.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filterConfig.price = {};
    if (req.query.minPrice) filterConfig.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filterConfig.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.rating) {
    filterConfig.averageRating = { $gte: Number(req.query.rating) };
  }

  let sortOption: any = { createdAt: -1 };

  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
    }
  }

  const count = await Product.countDocuments(filterConfig);

  // 🔥 Fetch raw products
  const productsRaw = await Product.find(filterConfig)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('category', 'name slug')
    .lean();

  // 🔥 Convert Decimal128 → number
  const products = productsRaw.map(convertDecimalFields);

  const responseData = {
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  };

  try {
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 60);
  } catch (err) {
    console.error('[Redis] Cache set error', err);
  }

  res.json(responseData);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const cacheKey = `product_${req.params.id}`;

  try {
    const cachedProduct = await redis.get(cacheKey);
    if (cachedProduct) return res.json(JSON.parse(cachedProduct));
  } catch {}

  const productRaw = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .lean();

  if (!productRaw) {
    res.status(404);
    throw new Error('Product not found');
  }

  const product = convertDecimalFields(productRaw);

  try {
    await redis.set(cacheKey, JSON.stringify(product), 'EX', 300);
  } catch {}

  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req: any, res: Response) => {
  const product = new Product({
    ...req.body,
    user: req.user?._id,
    images: req.body.images || [req.body.image],
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  Object.assign(product, req.body);
  const updatedProduct = await product.save();

  await redis.del(`product_${req.params.id}`);

  res.json(updatedProduct);
});

// @desc    Soft delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.isActive = false;
  await product.save();

  await redis.del(`product_${req.params.id}`);

  res.json({ message: 'Product removed' });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
