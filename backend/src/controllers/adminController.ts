import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req: any, res: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Admin] Generating dashboard stats for ${req.user?.email}`);
  }

  // 1. Total Revenue (Only paid and non-cancelled orders)
  const totalRevenueResult = await Order.aggregate([
    { 
      $match: { 
        isPaid: true, 
        status: { $ne: 'CANCELLED' } 
      } 
    },
    { 
      $group: { 
        _id: null, 
        total: { $sum: '$totalPrice' } 
      } 
    }
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  // 2. Revenue by Month (Last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const revenueByMonth = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        status: { $ne: 'CANCELLED' },
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // 3. Top Selling Products
  const topProducts = await Order.aggregate([
    { $match: { isPaid: true, status: { $ne: 'CANCELLED' } } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        image: { $first: '$orderItems.image' },
        totalSold: { $sum: '$orderItems.quantity' },
        revenueGenerated: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  // 4. Low Stock Products
  const lowStockProducts = await Product.find({ 
    stock: { $lt: 10 },
    isActive: true 
  })
  .select('name stock price image slug')
  .sort({ stock: 1 })
  .limit(10);

  // 5. User Metrics
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ 
    lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Active in last 30 days
  });

  // 6. Order Status Breakdown
  const orderStatus = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    revenue: {
      total: totalRevenue,
      history: revenueByMonth
    },
    products: {
      topSelling: topProducts,
      lowStock: lowStockProducts
    },
    users: {
      total: totalUsers,
      activeLast30Days: activeUsers
    },
    orders: {
      statusBreakdown: orderStatus
    }
  });
});

export { getDashboardStats };