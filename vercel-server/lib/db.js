// 共享数据库连接模块
const { MongoClient } = require('mongodb');

// MongoDB连接字符串（免费版）
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://huangtianrun333_db_user:ZD6TTJ23Gr7AvQ4l@cluster0.31jwgu8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = client.db('password_db');
  return cachedDb;
}

module.exports = { connectToDatabase };