# JFIF转JPG在线工具

本项目基于Next.js和sharp，可将JFIF图片在线转换为JPG格式，支持本地运行和Vercel一键部署。

## 使用方法

### 本地运行
1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动开发环境：
   ```bash
   npm run dev
   ```
3. 访问 http://localhost:3000 ，上传JFIF图片，点击转换并下载JPG。

### 部署到Vercel
1. 推送代码到GitHub。
2. 登录Vercel，导入该仓库，自动部署即可。

## 目录结构
```
jfif-to-jpg-converter/
├── package.json
├── pages/
│   ├── index.js           # 前端主页面
│   └── api/
│       └── convert.js     # 后端API，处理图片格式转换
├── README.md
```

## 依赖
- next
- react
- sharp
- formidable 