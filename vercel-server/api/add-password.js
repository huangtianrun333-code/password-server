// 添加临时密码API
const { connectToDatabase } = require('../lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, type, duration_minutes } = req.body;
    const db = await connectToDatabase();
    
    // 验证密码格式
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(password)) {
      return res.json({
        success: false,
        message: '密码必须包含字母和数字'
      });
    }
    
    // 验证密码长度
    const expectedLength = getExpectedLength(type);
    if (password.length !== expectedLength) {
      return res.json({
        success: false,
        message: `密码长度必须为${expectedLength}位`
      });
    }
    
    // 检查是否已存在
    const existing = await db.collection('temp_passwords').findOne({ password });
    if (existing) {
      return res.json({
        success: false,
        message: '密码已存在'
      });
    }
    
    // 添加到数据库
    await db.collection('temp_passwords').insertOne({
      password,
      type,
      duration_minutes,
      created_time: Date.now(),
      created_by: 'admin'
    });
    
    return res.json({
      success: true,
      message: '密码添加成功'
    });
    
  } catch (error) {
    console.error('Add Password Error:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
}

function getExpectedLength(type) {
  switch (type) {
    case 0: return 4;  // 30分钟
    case 1: return 6;  // 10小时
    case 2: return 7;  // 7天
    default: return 0;
  }
}