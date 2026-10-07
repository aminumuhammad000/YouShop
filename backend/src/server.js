// Fix DNS SRV timeout on Node.js v18+ (forces IPv4 DNS resolution and uses Google DNS)
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Failed to set DNS servers, using system default:', err.message);
}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const orderRoutes = require('./routes/orderRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const driverRoutes = require('./routes/driverRoutes');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

connectDB();

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/driver', driverRoutes);

// Search products
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const Product = global.isMockDB ? require('./models/mockDb').MockProduct : require('./models/Product');
    const products = await Product.find({});
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
// Dev server port listener reload final
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));