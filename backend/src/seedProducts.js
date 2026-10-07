const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Failed to set DNS servers, using system default:', err.message);
}

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
  {
    name: 'SPICY AWARA',
    description: 'A curated blend of onions, pepper and tofu, served hot.',
    price: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
  {
    name: 'CHICKEN SUYA',
    description: 'Spicy grilled skewered chicken seasoned with yaji pepper.',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  },
  {
    name: 'CHILLED ZOBO',
    description: 'Refreshing dark red hibiscus drink brewed with ginger and cloves.',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    console.log('Products seeded successfully:', created.length);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
