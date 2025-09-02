# 💰 个人记账工具 | Personal Finance Management App

一个现代化的个人记账管理应用，采用原生 JavaScript 开发，提供直观的数据可视化和响应式用户界面。

## ✨ 主要功能

- 📊 **数据可视化**：基于 Chart.js 的收支趋势图和分类统计
- 💳 **收支管理**：快速记录收入和支出，智能分类管理
- 📱 **响应式设计**：完美适配手机、平板和桌面设备
- 🌙 **深色主题**：护眼的暗色设计，提升使用体验
- 💾 **本地存储**：数据安全存储在本地浏览器

## 🚀 技术栈

- **前端框架**：原生 JavaScript ES6+
- **样式系统**：现代 CSS + 响应式布局
- **数据可视化**：Chart.js 4.4.x
- **图标字体**：FontAwesome 6.x
- **存储方案**：localStorage

## 📁 项目结构

```
├── 产品文档/
│   └── 产品设计.md          # 产品需求和设计文档
└── 设计文档/finance-app/    # 前端应用代码
    ├── index.html           # 应用入口
    ├── css/                 # 样式文件
    │   ├── base/           # 基础样式
    │   ├── components/     # 组件样式
    │   └── layouts/        # 布局样式
    ├── js/                 # JavaScript代码
    │   ├── components/     # 组件模块
    │   ├── utils/          # 工具函数
    │   └── main.js         # 主应用逻辑
    └── assets/             # 静态资源
```

## 🎨 设计特色

- **紫色渐变主题**：#667eea 到 #764ba2 的现代渐变配色
- **语义化颜色**：收入蓝 (#60a5fa)、支出橙 (#f97316)、净收支绿 (#4ade80)
- **优雅动画**：流畅的页面切换和图表加载动画
- **SF Pro 字体**：采用苹果设计系统字体

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/Yifei880802/finance-app.git
   cd finance-app
   ```

2. **启动本地服务器**
   ```bash
   # 使用 Python
   python3 -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   ```

3. **打开应用**
   
   访问 `http://localhost:8000/设计文档/finance-app/`

## 📋 功能页面

- **首页**：收支概览、快速记录、趋势图表
- **统计页面**：详细的数据分析和可视化图表
- **记录页面**：收支记录管理和分类统计

## 🌐 浏览器支持

- Chrome ≥ 60
- Firefox ≥ 55
- Safari ≥ 12
- Edge ≥ 79

## 📄 版本历史

- **v1.0.0** (2024-12-02) - 初始版本发布
  - 完整的记账管理功能
  - Chart.js 数据可视化
  - 三大核心页面实现
  - 响应式设计支持

## 👨‍💻 开发者

- **开发者**：yifei
- **邮箱**：669413918@qq.com
- **GitHub**：[@Yifei880802](https://github.com/Yifei880802)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

⭐ 如果这个项目对你有帮助，请给个 Star！