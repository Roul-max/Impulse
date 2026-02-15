import request from 'supertest';
import app from '../../app';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
import mongoose from 'mongoose';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Integration Test: Product Routes', () => {
  let categoryId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    // Setup initial data
    const category = await Category.create({
      name: 'Electronics',
      slug: 'electronics'
    });
    categoryId = category._id as mongoose.Types.ObjectId;

    await Product.create([
      {
        name: 'Test Product 1',
        slug: 'test-product-1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        category: categoryId,
        images: ['img1.jpg'],
        isActive: true
      },
      {
        name: 'Test Product 2',
        slug: 'test-product-2',
        description: 'Description 2',
        price: 200,
        stock: 5,
        category: categoryId,
        images: ['img2.jpg'],
        isActive: true
      }
    ]);
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.products[0]).toHaveProperty('name');
      expect(res.body.products[0]).toHaveProperty('price');
    });

    it('should filter products by keyword', async () => {
      const res = await request(app).get('/api/products?keyword=Product 1');

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].name).toBe('Test Product 1');
    });

    it('should paginate results', async () => {
      const res = await request(app).get('/api/products?limit=1&pageNumber=1');

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.pages).toBe(2);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product by ID', async () => {
      const product = await Product.findOne({ slug: 'test-product-1' });
      const res = await request(app).get(`/api/products/${product?._id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Product 1');
      expect(res.body._id).toBe(product?._id.toString());
    });

    it('should return 404 for invalid ID format', async () => {
      const res = await request(app).get('/api/products/invalid-id');
      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/products/${nonExistentId}`);
      expect(res.status).toBe(404);
    });
  });
});