const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const router = express.Router();

// Get dashboard analytics (admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastYear = new Date(now.getFullYear() - 1, 0, 1);

    // User analytics
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth }
    });
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) }
    });

    // Product analytics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });

    // Order analytics
    const totalOrders = await Order.countDocuments();
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: lastMonth }
    });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Revenue analytics
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'processing', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const revenueThisMonth = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: lastMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const revenueLastMonth = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 2, 1),
                     $lt: lastMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: { _id: '$orderItems.product', totalSold: { $sum: '$orderItems.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly revenue trend (last 12 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'processing', 'shipped'] },
          createdAt: { $gte: lastYear }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Category performance
    const categoryPerformance = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: '$orderItems.price' },
          quantity: { $sum: '$orderItems.quantity' },
          orders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          category: '$_id',
          revenue: 1,
          quantity: 1,
          orderCount: { $size: '$orders' }
        }
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        active: activeUsers
      },
      products: {
        total: totalProducts,
        featured: featuredProducts,
        outOfStock: outOfStockProducts
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth,
        completed: completedOrders,
        pending: pendingOrders
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        thisMonth: revenueThisMonth[0]?.total || 0,
        lastMonth: revenueLastMonth[0]?.total || 0,
        growth: revenueLastMonth[0] && revenueThisMonth[0] 
          ? ((revenueThisMonth[0].total - revenueLastMonth[0].total) / revenueLastMonth[0].total * 100).toFixed(2)
          : 0
      },
      topProducts,
      recentOrders,
      monthlyRevenue,
      orderStatusDistribution,
      categoryPerformance
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user analytics (for logged-in user)
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // User's orders
    const userOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const completedOrders = userOrders.filter(order => order.status === 'delivered').length;
    const pendingOrders = userOrders.filter(order => order.status === 'pending').length;

    // Order history by month
    const orderHistory = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Most purchased categories
    const categoryStats = await Order.aggregate([
      { $match: { user: userId } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: '$orderItems.quantity' },
          total: { $sum: '$orderItems.price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        totalSpent: totalSpent
      },
      orderHistory,
      categoryStats
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get real-time stats
router.get('/realtime', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

    // Today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: { $in: ['delivered', 'processing', 'shipped'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today }
    });

    // This hour's stats
    const hourOrders = await Order.countDocuments({
      createdAt: { $gte: thisHour }
    });

    const hourRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisHour },
          status: { $in: ['delivered', 'processing', 'shipped'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Active users (last 5 minutes)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(now - 5 * 60 * 1000) }
    });

    res.json({
      today: {
        orders: todayOrders,
        revenue: todayRevenue[0]?.total || 0,
        users: todayUsers
      },
      thisHour: {
        orders: hourOrders,
        revenue: hourRevenue[0]?.total || 0
      },
      activeUsers
    });
  } catch (error) {
    console.error('Real-time analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
