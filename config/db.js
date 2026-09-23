const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory / File Storage for seamless fallback
const memoryDb = {
  users: [],
  admins: [],
  subscriptionPlans: [],
  labels: [],
  noteEvents: [],
  eventPosts: [],
  postDetails: [],
  appointments: [],
  tasks: [],
  quickNotes: [],
  feedbacks: []
};

// Load initial file DB
const loadFileDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      Object.assign(memoryDb, parsed);
    } else {
      saveFileDb();
    }
  } catch (err) {
    console.error('Error reading JSON DB file:', err.message);
  }
};

const saveFileDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving JSON DB file:', err.message);
  }
};

loadFileDb();

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookapp', {
      serverSelectionTimeoutMS: 2000 // Quick timeout if Mongo isn't running locally
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`ℹ️ MongoDB connection unavailable (${error.message}). Using built-in JSON Database storage.`);
  }
};

module.exports = {
  connectDB,
  isMongo: () => isMongoConnected,
  memoryDb,
  saveFileDb
};
