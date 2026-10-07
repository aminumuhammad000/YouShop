const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial products list if file doesn't exist
const initialProducts = [
  {
    _id: '1',
    name: 'SPICY AWARA',
    description: 'A curated blend of onions, pepper and tofu, served hot.',
    price: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
  {
    _id: '2',
    name: 'CHICKEN SUYA',
    description: 'Spicy grilled skewered chicken seasoned with yaji pepper.',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  },
  {
    _id: '3',
    name: 'CHILLED ZOBO',
    description: 'Refreshing dark red hibiscus drink brewed with ginger and cloves.',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
  },
];

// Initial chats data
const initialChats = [
  {
    _id: 'chat1',
    name: 'Tasty Bites Restaurent',
    avatarColor: '#1F2937',
    lastMessage: "Yes it's available, 4000 for the small one, 7500 for the big p...",
    lastMessageTime: new Date().toISOString(),
    unread: 1,
    messages: [
      { id: 1, fromMe: true, text: "Hi, I'd like to place an order. Are you still accepting deliveries today?", time: '5:32 PM' },
      { id: 2, fromMe: false, isVoice: true, duration: '00:23', time: '5:48 PM' },
      { id: 3, fromMe: true, text: "I'd like the grilled chicken rice bowl and a bottle of water. Can I add extra sauce?", time: '6:02 PM' },
      { id: 4, fromMe: false, text: "Yes it's available, 4000 for the small one, 7500 for the big package, it'll be ready for delivery anytime after 9:00pm tonight.", time: '6:08 PM' },
    ],
  },
  {
    _id: 'chat2',
    name: 'Annie Brown',
    avatarColor: '#FBBF24',
    lastMessage: "Am reviewing your offer currently, i'll get back to you when i make ...",
    lastMessageTime: new Date().toISOString(),
    unread: 0,
    messages: [],
  },
  {
    _id: 'chat3',
    name: 'Ayman Clothing ng',
    avatarColor: '#FDE68A',
    lastMessage: 'The current morroco style i have is the original one, 600k last pri...',
    lastMessageTime: new Date().toISOString(),
    unread: 0,
    messages: [],
  },
  {
    _id: 'chat4',
    name: "Hajiya's Henna spot",
    avatarColor: '#4B5563',
    lastMessage: 'Yes there is a free spot on thursday in sha Allah.',
    lastMessageTime: new Date().toISOString(),
    unread: 2,
    messages: [],
  },
  {
    _id: 'chat5',
    name: 'Crunchy Bites',
    avatarColor: '#BFDBFE',
    lastMessage: 'Okay... How many do you need?',
    lastMessageTime: new Date().toISOString(),
    unread: 1,
    messages: [],
  },
  {
    _id: 'chat6',
    name: 'Karim Electronics',
    avatarColor: '#10B981',
    lastMessage: 'The replacement charger has arrived.',
    lastMessageTime: new Date().toISOString(),
    unread: 1,
    messages: [],
  },
  {
    _id: 'chat7',
    name: 'Sara Beauty Lounge',
    avatarColor: '#F472B6',
    lastMessage: 'Your appointment is booked for Friday.',
    lastMessageTime: new Date().toISOString(),
    unread: 3,
    messages: [],
  },
  {
    _id: 'chat8',
    name: 'Zainab Fashion Hub',
    avatarColor: '#1F2937',
    lastMessage: 'Your dress size is confirmed, thank you',
    lastMessageTime: new Date().toISOString(),
    unread: 0,
    messages: [],
  },
];

// Load helper
const loadData = (filePath, defaultData = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading mock data:', err.message);
    return defaultData;
  }
};

// Save helper
const saveData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving mock data:', err.message);
  }
};

// Helper to generate UUID-like IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const MockProduct = {
  find: async () => {
    return loadData(PRODUCTS_FILE, initialProducts);
  },
  findById: async (id) => {
    const list = loadData(PRODUCTS_FILE, initialProducts);
    return list.find((p) => p._id === id || p.id === id);
  },
  create: async (data) => {
    const list = loadData(PRODUCTS_FILE, initialProducts);
    const newProduct = { _id: generateId(), ...data };
    list.push(newProduct);
    saveData(PRODUCTS_FILE, list);
    return newProduct;
  },
  findByIdAndUpdate: async (id, data) => {
    const list = loadData(PRODUCTS_FILE, initialProducts);
    const index = list.findIndex((p) => p._id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      saveData(PRODUCTS_FILE, list);
      return list[index];
    }
    return null;
  },
  findByIdAndDelete: async (id) => {
    const list = loadData(PRODUCTS_FILE, initialProducts);
    const index = list.findIndex((p) => p._id === id);
    if (index !== -1) {
      const deleted = list[index];
      list.splice(index, 1);
      saveData(PRODUCTS_FILE, list);
      return deleted;
    }
    return null;
  },
};

const MockUser = {
  find: async () => {
    const list = loadData(USERS_FILE, []);
    return list.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
  },
  findOne: async (query) => {
    const list = loadData(USERS_FILE, []);
    if (query.email) {
      const targetEmail = query.email.trim().toLowerCase();
      return list.find((u) => u.email && u.email.trim().toLowerCase() === targetEmail);
    }
    return null;
  },
  findById: async (id) => {
    const list = loadData(USERS_FILE, []);
    const u = list.find((u) => u._id === id);
    if (u) {
      const { password, ...rest } = u;
      return { ...rest, select: () => rest };
    }
    return null;
  },
  create: async (data) => {
    const list = loadData(USERS_FILE, []);
    const newUser = { _id: generateId(), isBanned: false, isVerified: false, ...data };
    list.push(newUser);
    saveData(USERS_FILE, list);
    return newUser;
  },
  findByIdAndUpdate: async (id, updateData) => {
    const list = loadData(USERS_FILE, []);
    const index = list.findIndex((u) => u._id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updateData };
      saveData(USERS_FILE, list);
      const { password, ...rest } = list[index];
      return rest;
    }
    return null;
  },
  findByIdAndDelete: async (id) => {
    let list = loadData(USERS_FILE, []);
    const target = list.find((u) => u._id === id);
    if (target) {
      list = list.filter((u) => u._id !== id);
      saveData(USERS_FILE, list);
      return target;
    }
    return null;
  },
};

const MockChat = {
  find: async () => {
    return loadData(CHATS_FILE, initialChats);
  },
  findById: async (id) => {
    const list = loadData(CHATS_FILE, initialChats);
    return list.find((c) => c._id === id);
  },
  create: async (data) => {
    const list = loadData(CHATS_FILE, initialChats);
    const newChat = { _id: 'chat_' + generateId(), messages: [], ...data };
    list.unshift(newChat);
    saveData(CHATS_FILE, list);
    return newChat;
  },
  addMessage: async (id, message) => {
    const list = loadData(CHATS_FILE, initialChats);
    const chat = list.find((c) => c._id === id);
    if (chat) {
      if (!chat.messages) chat.messages = [];
      // Use a unique ID per message across all chats
      message.id = `${id}_${generateId()}_${Date.now()}`;
      chat.messages.push(message);
      chat.lastMessage = message.text || 'Voice message';
      chat.lastMessageTime = new Date().toISOString();
      saveData(CHATS_FILE, list);
      return chat;
    }
    return null;
  },
};

const MockOrder = {
  find: async () => {
    return loadData(ORDERS_FILE, []);
  },
  findById: async (id) => {
    const list = loadData(ORDERS_FILE, []);
    return list.find((o) => o._id === id);
  },
  create: async (data) => {
    const list = loadData(ORDERS_FILE, []);
    const newOrder = { _id: generateId(), ...data, createdAt: new Date().toISOString() };
    list.push(newOrder);
    saveData(ORDERS_FILE, list);
    return newOrder;
  },
  findByIdAndUpdate: async (id, data) => {
    const list = loadData(ORDERS_FILE, []);
    const index = list.findIndex((o) => o._id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      saveData(ORDERS_FILE, list);
      return list[index];
    }
    return null;
  },
};

const initialCategories = [
  {_id:'cat1', name:'Food', description:'Gourmet foods and local dishes'}, 
  {_id:'cat2', name:'Drinks', description:'Beverages, juices and zobos'}, 
  {_id:'cat3', name:'Electronics', description:'Gadgets and accessories'}, 
  {_id:'cat4', name:'Clothing', description:'Apparel and fashion'}
];

const MockCategory = {
  find: async () => loadData(CATEGORIES_FILE, initialCategories),
  create: async (data) => {
    const list = loadData(CATEGORIES_FILE, initialCategories);
    const newCategory = { _id: generateId(), ...data };
    list.push(newCategory);
    saveData(CATEGORIES_FILE, list);
    return newCategory;
  },
  findByIdAndDelete: async (id) => {
    const list = loadData(CATEGORIES_FILE, initialCategories);
    const index = list.findIndex(c => c._id === id);
    if (index !== -1) {
      const deleted = list[index];
      list.splice(index, 1);
      saveData(CATEGORIES_FILE, list);
      return deleted;
    }
    return null;
  }
};

const MockCoupon = {
  find: async () => loadData(COUPONS_FILE, []),
  create: async (data) => {
    const list = loadData(COUPONS_FILE, []);
    const newCoupon = { _id: generateId(), ...data };
    list.push(newCoupon);
    saveData(COUPONS_FILE, list);
    return newCoupon;
  },
  findByIdAndUpdate: async (id, data) => {
    const list = loadData(COUPONS_FILE, []);
    const index = list.findIndex(c => c._id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      saveData(COUPONS_FILE, list);
      return list[index];
    }
    return null;
  },
  findByIdAndDelete: async (id) => {
    const list = loadData(COUPONS_FILE, []);
    const index = list.findIndex(c => c._id === id);
    if (index !== -1) {
      const deleted = list[index];
      list.splice(index, 1);
      saveData(COUPONS_FILE, list);
      return deleted;
    }
    return null;
  }
};

const MockNotification = {
  find: async () => loadData(NOTIFICATIONS_FILE, []),
  markAllRead: async () => {
    const list = loadData(NOTIFICATIONS_FILE, []);
    const updated = list.map((notification) => ({ ...notification, read: true }));
    saveData(NOTIFICATIONS_FILE, updated);
    return updated;
  },
  create: async (data) => {
    const list = loadData(NOTIFICATIONS_FILE, []);
    const newNotification = { _id: generateId(), createdAt: new Date().toISOString(), ...data };
    list.push(newNotification);
    saveData(NOTIFICATIONS_FILE, list);
    return newNotification;
  }
};

const MockLog = {
  find: async () => loadData(LOGS_FILE, []),
  create: async (data) => {
    const list = loadData(LOGS_FILE, []);
    const newLog = { _id: generateId(), createdAt: new Date().toISOString(), ...data };
    list.push(newLog);
    saveData(LOGS_FILE, list);
    return newLog;
  }
};

module.exports = { MockProduct, MockUser, MockChat, MockOrder, MockCategory, MockCoupon, MockNotification, MockLog };
