export const vendorDashboardStats = {
  totalProducts: 134,
  totalOrders: 48,
  pendingOrders: 12,
  completedOrders: 31,
  totalSales: 284500,
  availableBalance: 76750,
  storeRating: 4.8,
};

export const recentOrders = [
  { id: '#YH-1042', customer: 'Aisha Musa', products: 'Wireless Headset', qty: 2, total: 45000, payment: 'Paid', status: 'Processing', date: '2026-08-10' },
  { id: '#YH-1043', customer: 'Daniel John', products: 'Luxury Sneakers', qty: 1, total: 32000, payment: 'Paid', status: 'Shipped', date: '2026-08-11' },
  { id: '#YH-1044', customer: 'Sarah Ali', products: 'Smart Watch', qty: 3, total: 89000, payment: 'Pending', status: 'Pending', date: '2026-08-12' },
  { id: '#YH-1045', customer: 'Musa Bello', products: 'Coffee Maker', qty: 1, total: 27000, payment: 'Paid', status: 'Delivered', date: '2026-08-13' },
];

export const recentSales = [
  { label: 'Jan', value: 35600 },
  { label: 'Feb', value: 42100 },
  { label: 'Mar', value: 39000 },
  { label: 'Apr', value: 54800 },
  { label: 'May', value: 63000 },
  { label: 'Jun', value: 71400 },
  { label: 'Jul', value: 68800 },
  { label: 'Aug', value: 82000 },
];

export const dashboardStats = [
    { label: 'Total Sales', value: '₦284,500', trend: '+14.2% vs last month', icon: 'sales' },
    { label: 'Orders', value: '48', trend: '+9.1% vs last month', icon: 'orders' },
    { label: 'Customers', value: '1,420', trend: '+12.4% vs last month', icon: 'customers' },
    { label: 'Avg. Order Value', value: '₦14,000', trend: '+3.5% vs last month', icon: 'analytics' },
];

export const earnings = [
  { month: 'Jan', amount: 35600 },
  { month: 'Feb', amount: 42100 },
  { month: 'Mar', amount: 39000 },
  { month: 'Apr', amount: 54800 },
  { month: 'May', amount: 63000 },
  { month: 'Jun', amount: 71400 },
];

export const topProducts = [
  { name: 'Wireless Headset', sales: 120, stock: 42, price: 25000 },
  { name: 'Luxury Sneakers', sales: 95, stock: 18, price: 32000 },
  { name: 'Smart Watch', sales: 85, stock: 23, price: 45000 },
  { name: 'Coffee Maker', sales: 72, stock: 16, price: 27000 },
];

export const notifications = [
  { id: 1, title: 'Account approved', detail: 'Your vendor account was approved by the marketplace team.', time: '2h ago' },
  { id: 2, title: 'New order received', detail: 'Order #YH-1042 was placed successfully.', time: '3h ago' },
  { id: 3, title: 'Withdrawal processed', detail: 'A withdrawal of ₦50,000 is being processed.', time: '1d ago' },
];

export const products = [
  { id: 1, name: 'Wireless Headset', category: 'Electronics', price: 25000, stock: 42, status: 'Published', vendor_id: 'VEN-1001' },
  { id: 2, name: 'Luxury Sneakers', category: 'Fashion', price: 32000, stock: 18, status: 'Published', vendor_id: 'VEN-1001' },
  { id: 3, name: 'Smart Watch', category: 'Electronics', price: 45000, stock: 23, status: 'Draft', vendor_id: 'VEN-1001' },
  { id: 4, name: 'Coffee Maker', category: 'Home', price: 27000, stock: 16, status: 'Published', vendor_id: 'VEN-1001' },
];
