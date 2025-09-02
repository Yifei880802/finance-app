# 简记 - 记账APP 部署和使用指南

## 🚀 快速开始

### 1. 项目概述
简记是一款面向80后群体的极简记账应用，采用原生Web技术开发，支持PWA安装，具有以下特色：
- 深色主题 + 科技蓝配色设计
- 响应式布局，适配移动端和桌面端
- 数据可视化图表展示
- 本地存储 + IndexedDB数据持久化
- 模块化组件架构

### 2. 技术栈
- **前端框架**: 原生HTML5 + CSS3 + JavaScript ES6+
- **样式系统**: CSS Variables + 模块化CSS
- **图表库**: Chart.js 4.x
- **图标库**: FontAwesome 6.x
- **数据存储**: LocalStorage + IndexedDB
- **构建工具**: 无需构建，直接运行

## 📁 项目结构

```
finance-app/
├── index.html                 # 主入口文件
├── README.md                  # 项目说明文档
├── assets/                    # 静态资源目录
│   ├── images/               # 图片资源
│   │   ├── icons/           # 图标文件
│   │   └── backgrounds/     # 背景图片
│   ├── fonts/               # 字体文件
│   └── favicon.ico          # 网站图标
├── css/                      # 样式文件目录
│   ├── base/                # 基础样式
│   │   ├── reset.css        # CSS重置
│   │   ├── variables.css    # CSS变量
│   │   └── utilities.css    # 工具类
│   ├── components/          # 组件样式
│   │   ├── navbar.css       # 导航组件
│   │   ├── cards.css        # 卡片组件
│   │   ├── forms.css        # 表单组件
│   │   └── charts.css       # 图表组件
│   ├── layouts/             # 布局样式
│   │   ├── grid.css         # 网格系统
│   │   └── containers.css   # 容器布局
│   └── main.css             # 主样式文件
├── js/                       # JavaScript文件目录
│   ├── components/          # 组件脚本
│   │   ├── navbar.js        # 导航管理
│   │   ├── charts.js        # 图表管理
│   │   └── forms.js         # 表单管理
│   ├── utils/               # 工具函数
│   │   ├── storage.js       # 存储管理
│   │   └── helpers.js       # 辅助函数
│   └── main.js              # 主应用脚本
└── pages/                    # 页面模板（预留）
    ├── home.html            # 首页模板
    ├── record.html          # 记账页模板
    ├── stats.html           # 统计页模板
    └── settings.html        # 设置页模板
```

## 🛠 本地开发

### 方法一：直接打开（推荐）
```bash
# 1. 直接用浏览器打开index.html
open index.html
# 或双击index.html文件
```

### 方法二：本地服务器
```bash
# 使用Python内置服务器
cd finance-app
python -m http.server 8000

# 或使用Node.js服务器
npx http-server -p 8000

# 访问应用
# http://localhost:8000
```

### 方法三：Live Server（VS Code）
1. 安装Live Server插件
2. 右键点击index.html
3. 选择"Open with Live Server"

## 📱 功能特性

### 核心功能
- **记账管理**: 快速记录收入和支出
- **智能分类**: 自动分类推荐和管理
- **数据统计**: 收支趋势和分类分析
- **可视化图表**: 环形图、折线图、柱状图
- **本地存储**: 数据持久化保存
- **响应式设计**: 适配各种设备尺寸

### 页面功能

#### 1. 首页 (Home)
- 月度收支概览卡片
- 环形图表显示收支比例
- 最近记账记录列表
- 快捷记账浮动按钮

#### 2. 记账 (Record)
- 收支类型选择器
- 大字号金额输入
- 分类网格选择
- 备注信息输入
- 快捷金额按钮

#### 3. 统计 (Stats)
- 时间筛选器（本月、近3月、近半年、近一年）
- 关键指标卡片（收入、支出、结余、日均）
- 收支趋势折线图
- 支出分类分析

#### 4. 设置 (Settings)
- 用户信息管理
- 账户和分类管理
- 数据备份和导出
- 应用设置开关

## 🎨 设计系统

### 色彩规范
```css
/* 主要颜色 */
--primary-bg: #1E1E1E;        /* 主背景色 */
--secondary-bg: #2C2C2C;      /* 次要背景色 */
--accent-blue: #007AFF;       /* 科技蓝强调色 */
--text-primary: #FFFFFF;      /* 主要文字色 */
--text-secondary: #AAAAAA;    /* 次要文字色 */
--success-color: #34C759;     /* 成功色（收入） */
--warning-color: #FF3B30;     /* 警告色（支出） */
```

### 字体规范
- **主字体**: SF Pro Display / 系统字体
- **字体大小**: 12px - 48px（响应式）
- **字体权重**: 400 (Normal), 500 (Medium), 600 (Semibold), 700 (Bold)

### 间距规范
- **基础单元**: 4px
- **常用间距**: 8px, 12px, 16px, 24px, 32px
- **组件间距**: 16px - 24px
- **页面边距**: 16px

### 圆角规范
- **小圆角**: 8px（按钮、输入框）
- **中圆角**: 12px（卡片、列表项）  
- **大圆角**: 16px（主要容器）
- **圆形**: 50%（头像、图标背景）

## 📊 数据结构

### 记账记录 (Record)
```javascript
{
  id: "rec_1234567890",
  type: "expense",              // "income" | "expense"
  amount: 45.00,               // 金额
  category: "food",            // 分类ID
  description: "午餐",         // 描述
  date: "2025-09-01T12:00:00Z", // 记录时间
  account: "default"           // 账户ID
}
```

### 分类 (Category)
```javascript
{
  id: "food",
  name: "餐饮",
  icon: "fas fa-utensils",
  color: "#FF3B30",
  type: "expense"              // "income" | "expense"
}
```

### 应用设置 (Settings)
```javascript
{
  theme: "dark",               // "dark" | "light"
  currency: "CNY",             // 货币代码
  notifications: true,         // 通知开关
  budget: 5000                 // 月度预算
}
```

## 🔧 自定义配置

### 修改主题色彩
编辑 `css/base/variables.css` 文件：
```css
:root {
  --accent-blue: #007AFF;      /* 修改主题色 */
  --success-color: #34C759;    /* 修改收入颜色 */
  --warning-color: #FF3B30;    /* 修改支出颜色 */
}
```

### 添加新分类
编辑 `js/main.js` 中的 `initializeCategories` 方法：
```javascript
// 添加新的支出分类
{ 
  id: 'travel', 
  name: '旅行', 
  icon: 'fas fa-plane', 
  color: '#5856D6', 
  type: 'expense' 
}
```

### 修改图表配置
编辑 `js/components/charts.js` 文件中相应的图表配置。

## 🚀 生产部署

### 静态托管平台

#### GitHub Pages
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是main或gh-pages）
4. 访问生成的URL

#### Netlify
1. 拖拽项目文件夹到Netlify部署页面
2. 或连接GitHub仓库自动部署
3. 配置自定义域名（可选）

#### Vercel
```bash
# 安装Vercel CLI
npm i -g vercel

# 在项目根目录执行
vercel

# 按提示配置并部署
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/finance-app;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用gzip压缩
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

## 📱 PWA安装

### 创建manifest.json
```json
{
  "name": "简记 - 极简记账",
  "short_name": "简记",
  "description": "面向80后的极简记账应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1E1E1E",
  "theme_color": "#007AFF",
  "icons": [
    {
      "src": "./assets/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "./assets/images/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 添加Service Worker
创建 `sw.js` 文件实现离线缓存功能。

## 🔍 调试和故障排除

### 常见问题

#### 1. 图表不显示
- 检查Chart.js库是否正确加载
- 确认canvas元素存在且有正确的ID
- 查看浏览器控制台错误信息

#### 2. 数据不保存
- 检查浏览器是否支持LocalStorage
- 确认没有隐私模式限制
- 查看IndexedDB初始化状态

#### 3. 样式异常
- 确认CSS文件加载顺序正确
- 检查CSS变量是否定义
- 验证浏览器兼容性

#### 4. 移动端显示问题
- 检查viewport meta标签设置
- 确认touch事件处理正确
- 测试安全区域适配

### 开发工具
- **Chrome DevTools**: 调试和性能分析
- **Lighthouse**: 性能和可访问性审计
- **Responsive Design Mode**: 响应式测试

## 🧪 测试建议

### 功能测试
- [ ] 记账功能完整流程
- [ ] 数据统计准确性
- [ ] 页面导航和路由
- [ ] 表单验证逻辑
- [ ] 数据持久化

### 兼容性测试
- [ ] Chrome 90+
- [ ] Safari 14+
- [ ] Firefox 88+
- [ ] Edge 90+
- [ ] iOS Safari 14+
- [ ] Android Chrome 90+

### 性能测试
- [ ] 首屏加载时间 < 3s
- [ ] 图表渲染性能
- [ ] 大量数据处理
- [ ] 内存使用情况

## 📈 性能优化

### 代码优化
- 压缩CSS和JavaScript文件
- 启用HTTP/2和gzip压缩
- 使用CDN加速外部资源
- 实现图片懒加载

### 缓存策略
```javascript
// Service Worker缓存示例
const CACHE_NAME = 'finance-app-v1';
const urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  // 其他静态资源
];
```

## 📚 扩展开发

### 添加新页面
1. 在`pages/`目录创建HTML模板
2. 在主应用中添加路由逻辑
3. 创建对应的CSS和JS文件
4. 更新导航菜单

### 集成后端API
```javascript
// API调用示例
class ApiService {
  async saveRecord(record) {
    const response = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    return response.json();
  }
}
```

### 数据同步
实现云端数据同步功能，支持多设备数据共享。

## 📝 更新日志

### v1.0.0 (2025-09-01)
- ✅ 初始版本发布
- ✅ 基础记账功能
- ✅ 数据可视化图表
- ✅ 响应式设计
- ✅ 本地数据存储
- ✅ PWA支持

## 🤝 贡献指南

### 开发规范
- 使用语义化命名
- 遵循BEM CSS命名规范
- 编写清晰的注释
- 保持代码一致性

### 提交规范
```bash
# 功能开发
git commit -m "feat: 添加导出功能"

# 错误修复  
git commit -m "fix: 修复图表显示问题"

# 样式调整
git commit -m "style: 优化移动端布局"
```

## 📄 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。

## 📞 技术支持

如有问题或建议，请通过以下方式联系：
- GitHub Issues: [项目仓库]
- 邮箱: design@example.com
- 技术文档: [在线文档地址]

---

**简记团队** © 2025