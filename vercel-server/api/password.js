// Vercel Serverless API - 完全免费部署
const { connectToDatabase } = require('../lib/db');

// 验证密码API
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, deviceId } = req.body;
    const db = await connectToDatabase();
    
    // 验证管理员密码
    if (password === 'huangtianrun1') {
      return res.json({
        valid: true,
        message: '管理员登录成功',
        expiry_time: 0
      });
    }
    
    // 验证永久用户密码
    if (password === 'huangtianrun') {
      return res.json({
        valid: true,
        message: '永久用户登录成功',
        expiry_time: 0
      });
    }
    
    // 验证临时密码
    const tempPassword = await db.collection('temp_passwords').findOne({ password });
    
    if (!tempPassword) {
      return res.json({
        valid: false,
        message: '无效的密码'
      });
    }
    
    // 检查是否已激活
    const activated = await db.collection('activated_passwords').findOne({ 
      password, 
      is_active: true 
    });
    
    const currentTime = Date.now();
    
    if (activated) {
      // 已激活，检查是否过期
      if (currentTime <= activated.expiry_time) {
        return res.json({
          valid: true,
          message: '临时密码登录成功',
          expiry_time: activated.expiry_time
        });
      } else {
        // 标记为过期
        await db.collection('activated_passwords').updateOne(
          { _id: activated._id },
          { $set: { is_active: false } }
        );
        return res.json({
          valid: false,
          message: '密码已过期'
        });
      }
    } else {
      // 首次激活
      const expiryTime = currentTime + tempPassword.duration_minutes * 60 * 1000;
      
      await db.collection('activated_passwords').insertOne({
        password,
        device_id: deviceId,
        activated_time: currentTime,
        expiry_time: expiryTime,
        is_active: true
      });
      
      return res.json({
        valid: true,
        message: '临时密码激活成功',
        expiry_time: expiryTime
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      valid: false,
      message: '服务器内部错误'
    });
  }
}