const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    const config = require('./config');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@uniserve.ai',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create sample products
    const products = [
      {
        name: 'Student Bundle',
        description: 'Perfect package for students including ChatGPT Premium, NotebookLM Pro, Super Duolingo, and Microsoft 365 with 1TB Google Drive storage.',
        price: 19,
        category: 'student',
        image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Student+Bundle',
        features: [
          'ChatGPT Premium',
          'NotebookLM Pro',
          'Super Duolingo',
          'Microsoft 365 products',
          '1TB Google Drive storage'
        ],
        stockQuantity: 100,
        inStock: true,
        isDigital: true,
        tags: ['student', 'education', 'productivity', 'ai'],
        isFeatured: true
      },
      {
        name: 'Creative Bundle',
        description: 'Complete creative toolkit with ChatGPT Premium, Canva Pro, CapCut Pro, and Lightroom Pro for all your creative needs.',
        price: 29,
        category: 'creator',
        image: 'https://via.placeholder.com/300x200/FF9800/white?text=Creative+Bundle',
        features: [
          'ChatGPT Premium',
          'Canva Pro',
          'CapCut Pro',
          'Lightroom Pro'
        ],
        stockQuantity: 50,
        inStock: true,
        isDigital: true,
        tags: ['creator', 'design', 'video', 'photography'],
        isFeatured: true
      },
      {
        name: 'Startup Bundle',
        description: 'Essential tools for startups including Shopify, Stripe payment processing, and 1TB Google Drive for business operations.',
        price: 34,
        category: 'startup',
        image: 'https://via.placeholder.com/300x200/2196F3/white?text=Startup+Bundle',
        features: [
          'Shopify',
          'Stripe',
          '1TB Google Drive',
          'Business analytics tools'
        ],
        stockQuantity: 30,
        inStock: true,
        isDigital: true,
        tags: ['startup', 'business', 'ecommerce', 'analytics'],
        isFeatured: true
      },
      {
        name: 'UniServe AI Platform & Development Services',
        description: 'Complete AI platform with real user interfaces, integrated AI tools, and professional development services for web, mobile, and custom applications.',
        price: 999,
        category: 'uniserve',
        image: 'https://via.placeholder.com/300x200/9C27B0/white?text=UniServe+AI',
        features: [
          'AI platform with real user interfaces',
          'AI tools integrated as features',
          'Unified experience across Web, Mobile App, Dashboard',
          'Development services: Websites, Applications, Games',
          'Built by professional developers',
          '100% custom-built from scratch',
          'Developed entirely inside UniServe AI'
        ],
        stockQuantity: 10,
        inStock: true,
        isDigital: false,
        tags: ['ai', 'development', 'platform', 'custom'],
        isFeatured: true,
        discountPrice: 799,
        discountUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        name: 'Web Development Masterclass',
        description: 'Complete web development course covering HTML, CSS, JavaScript, React, Node.js, and modern web technologies.',
        price: 89,
        category: 'education',
        image: 'https://via.placeholder.com/300x200/00BCD4/white?text=Web+Dev+Course',
        features: [
          '50+ hours of video content',
          'Real-world projects',
          'Certificate of completion',
          'Lifetime access',
          'Community support'
        ],
        stockQuantity: 1000,
        inStock: true,
        isDigital: true,
        tags: ['education', 'web', 'programming', 'course']
      },
      {
        name: 'Cybersecurity Essentials',
        description: 'Comprehensive cybersecurity training covering network security, ethical hacking, and security best practices.',
        price: 129,
        category: 'cybersecurity',
        image: 'https://via.placeholder.com/300x200/F44336/white?text=Cybersecurity',
        features: [
          'Network security fundamentals',
          'Ethical hacking techniques',
          'Security best practices',
          'Hands-on labs',
          'Industry certification prep'
        ],
        stockQuantity: 500,
        inStock: true,
        isDigital: true,
        tags: ['cybersecurity', 'security', 'training', 'certification']
      },
      {
        name: 'AI Consultation Package',
        description: 'Personalized AI consultation for businesses looking to implement AI solutions and automation.',
        price: 299,
        category: 'consultation',
        image: 'https://via.placeholder.com/300x200/607D8B/white?text=AI+Consultation',
        features: [
          '2-hour consultation session',
          'AI implementation roadmap',
          'Custom solution recommendations',
          'Follow-up support',
          'Technical documentation'
        ],
        stockQuantity: 20,
        inStock: true,
        isDigital: false,
        tags: ['consultation', 'ai', 'business', 'strategy']
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    // Add some reviews to products
    const createdProducts = await Product.find({});
    for (let i = 0; i < Math.min(3, createdProducts.length); i++) {
      await createdProducts[i].addReview(
        adminUser._id,
        5,
        'Excellent product! Highly recommended for anyone looking for quality and value.'
      );
    }
    console.log('Sample reviews added');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
