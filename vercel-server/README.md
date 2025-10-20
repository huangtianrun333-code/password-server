# 跨设备密码服务器部署指南

## 快速部署步骤

### 1. 注册服务（5分钟）
1. 注册 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 免费账号
2. 注册 [Vercel](https://vercel.com) 使用GitHub账号
3. 创建GitHub仓库

### 2. 配置数据库
1. 在MongoDB Atlas创建免费集群
2. 获取连接字符串
3. 创建数据库 `password_db`

### 3. 部署到Vercel
1. 将代码上传到GitHub
2. 在Vercel导入项目
3. 配置环境变量：`MONGODB_URI`

### 4. 修改Android应用
修改 `PasswordService.java` 中的服务器地址：

```java
private static final String BASE_URL = "https://your-app.vercel.app/api";
```

## 环境变量配置

在Vercel项目设置中添加：
- `MONGODB_URI`: MongoDB连接字符串

## API接口

### 密码验证
- **URL**: `/api/password`
- **方法**: POST
- **参数**: `password`, `deviceId`

### 添加临时密码
- **URL**: `/api/add-password`  
- **方法**: POST
- **参数**: `password`, `type`

## 技术支持
如有问题，请查看详细部署文档。