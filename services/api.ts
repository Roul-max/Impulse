import axios from '../utils/axios';
import { Product, LoginCredentials, RegisterCredentials, User, Order, DashboardStats } from '../types';

export const ApiService = {
  // Auth
  async login(credentials: LoginCredentials) {
    const { data } = await axios.post<User>('/auth/login', credentials);
    return data;
  },

  async register(credentials: RegisterCredentials) {
    const { data } = await axios.post<User>('/auth/register', credentials);
    return data;
  },

  async logout() {
    await axios.post('/auth/logout');
  },

  async refreshToken() {
    await axios.post('/auth/refresh');
  },

  // Products
  async getProducts(params?: any) {
    const { data } = await axios.get<{ products: Product[], page: number, pages: number }>('/products', { params });
    return data;
  },

  async getProductById(id: string) {
    const { data } = await axios.get<Product>(`/products/${id}`);
    return data;
  },

  // Cart
  async getCart() {
    const { data } = await axios.get('/cart');
    return data;
  },

  async addToCart(productId: string, quantity: number, variant?: any) {
    const { data } = await axios.post('/cart', { productId, quantity, variant });
    return data;
  },

  async updateCartItem(productId: string, quantity: number) {
    const { data } = await axios.put(`/cart/${productId}`, { quantity });
    return data;
  },

  async removeFromCart(productId: string) {
    const { data } = await axios.delete(`/cart/${productId}`);
    return data;
  },

  async syncCart(items: any[]) {
    const { data } = await axios.post('/cart/sync', { items });
    return data;
  },

  // Orders
  async createOrder(orderData: any) {
    const { data } = await axios.post<Order>('/orders', orderData);
    return data;
  },

  async getMyOrders() {
    const { data } = await axios.get<Order[]>('/orders/myorders');
    return data;
  },

  async getOrderById(id: string) {
    const { data } = await axios.get<Order>(`/orders/${id}`);
    return data;
  },

  // Payments
  async createPaymentOrder(orderId: string) {
    const { data } = await axios.post('/payments/create-order', { orderId });
    return data;
  },

  async verifyPayment(paymentData: any) {
    const { data } = await axios.post('/payments/verify', paymentData);
    return data;
  },

  // Admin
  async getDashboardStats() {
    const { data } = await axios.get<DashboardStats>('/admin/stats');
    return data;
  }
};