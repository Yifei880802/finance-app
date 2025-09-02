/**
 * 主应用控制器
 * 负责应用初始化、路由管理和全局状态管理
 * Author: 开发团队
 * Version: 1.0.0
 */

class FinanceApp {
  constructor() {
    this.currentPage = 'home';
    this.data = {
      records: [],
      categories: [],
      settings: {}
    };
    this.charts = {};
    
    // 图表初始化状态标记
    this._homeChartInitialized = false;
    this._statsChartInitialized = false;
    
    this.init();
  }
  
  /**
   * 应用初始化
   */
  init() {
    this.initializeData();
    this.setupEventListeners();
    this.initializeCharts();
    this.showPage('home');
    
    // 显示加载完成提示
    console.log('🎉 简记APP加载完成');
  }
  
  /**
   * 初始化图表
   */
  initializeCharts() {
    console.log('📈 开始初始化图表管理器...');
    
    // 增强的Chart.js检查函数
    const checkChartJs = () => {
      const isLoaded = typeof Chart !== 'undefined' && Chart.version;
      if (isLoaded) {
        console.log('✅ Chart.js库已加载，版本:', Chart.version);
        this.createChartManager();
        return true;
      }
      return false;
    };
    
    // 立即检查
    if (checkChartJs()) {
      return;
    }
    
    console.log('⏳ Chart.js尚未加载，等待加载完成...');
    
    // 等待Chart.js加载事件
    const chartJsLoadHandler = () => {
      console.log('📦 收到Chart.js加载事件');
      if (checkChartJs()) {
        window.removeEventListener('chartJsLoaded', chartJsLoadHandler);
      }
    };
    
    window.addEventListener('chartJsLoaded', chartJsLoadHandler);
    
    // 超时检查机制（最多等待30秒）
    let attempts = 0;
    const maxAttempts = 150; // 30秒，每200ms检查一次
    
    const timeoutCheck = () => {
      attempts++;
      
      // 检查是否已加载
      if (checkChartJs()) {
        window.removeEventListener('chartJsLoaded', chartJsLoadHandler);
        return;
      }
      
      // 检查是否有加载错误
      if (window.chartJsLoadError) {
        console.error('❌ Chart.js加载失败！所有CDN都无法访问');
        window.removeEventListener('chartJsLoaded', chartJsLoadHandler);
        this.showChartLoadError();
        return;
      }
      
      // 检查是否超时
      if (attempts >= maxAttempts) {
        console.error('❌ Chart.js加载超时！请检查网络连接');
        window.removeEventListener('chartJsLoaded', chartJsLoadHandler);
        this.showChartLoadError();
        return;
      }
      
      // 继续等待
      setTimeout(timeoutCheck, 200);
    };
    
    setTimeout(timeoutCheck, 200);
  }
  
  /**
   * 创建图表管理器
   */
  createChartManager() {
    // 创建图表管理器实例
    if (!window.chartManager && typeof ChartManager !== 'undefined') {
      console.log('📈 创建主应用图表管理器实例');
      window.chartManager = new ChartManager();
    }
    
    // 延迟初始化，确保DOM已加载
    setTimeout(() => {
      if (window.chartManager && this.currentPage === 'home') {
        console.log('🏠 自动初始化首页年度趋势图表');
        this.initializeHomeChart();
      } else if (!window.chartManager) {
        console.error('⚠️ 图表管理器初始化失败！');
      }
    }, 1000);
  }
  
  /**
   * 初始化首页图表
   */
  initializeHomeChart() {
    const canvas = document.getElementById('yearlyTrendChart');
    if (canvas && window.chartManager) {
      try {
        const chart = window.chartManager.initializeYearlyTrendChart();
        if (chart) {
          this._homeChartInitialized = true;
          console.log('✅ 首页图表自动初始化成功');
        }
      } catch (error) {
        console.error('❌ 首页图表自动初始化失败:', error);
      }
    }
  }
  
  /**
   * 显示图表加载错误
   */
  showChartLoadError() {
    console.warn('📈 显示图表加载错误提示');
    
    // 在图表容器中显示错误信息
    const chartContainers = [
      document.getElementById('yearlyTrendChart'),
      document.getElementById('trendChart'),
      document.getElementById('categoryChart')
    ];
    
    chartContainers.forEach(canvas => {
      if (canvas) {
        const container = canvas.parentElement;
        if (container && !container.querySelector('.chart-error')) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'chart-error';
          errorDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: #8E8E93;
            text-align: center;
            font-size: 14px;
          `;
          errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 12px; color: #FF9500;"></i>
            <div style="margin-bottom: 8px; font-weight: 500;">图表加载失败</div>
            <div style="font-size: 12px; color: #6D6D70;">请检查网络连接或刷新页面重试</div>
            <button onclick="window.reloadChartJs && window.reloadChartJs()" 
                    style="margin-top: 12px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
              重新加载
            </button>
          `;
          
          canvas.style.display = 'none';
          container.appendChild(errorDiv);
        }
      }
    });
  }
  
  /**
   * 初始化数据
   */
  initializeData() {
    // 加载本地存储的数据
    this.loadFromStorage();
    
    // 如果没有数据，创建示例数据
    if (this.data.records.length === 0) {
      this.createSampleData();
    }
    
    // 初始化分类数据
    if (this.data.categories.length === 0) {
      this.initializeCategories();
    }
  }
  
  /**
   * 创建示例数据
   */
  createSampleData() {
    const sampleRecords = [
      {
        id: 'rec_001',
        type: 'expense',
        amount: 45.00,
        category: 'food',
        description: '午餐',
        date: new Date().toISOString(),
        account: 'default'
      },
      {
        id: 'rec_002',
        type: 'expense',
        amount: 28.00,
        category: 'transport',
        description: '打车费',
        date: new Date(Date.now() - 3600000).toISOString(),
        account: 'default'
      },
      {
        id: 'rec_003',
        type: 'income',
        amount: 8500.00,
        category: 'salary',
        description: '工资',
        date: new Date(Date.now() - 86400000).toISOString(),
        account: 'default'
      },
      {
        id: 'rec_004',
        type: 'expense',
        amount: 120.00,
        category: 'shopping',
        description: '服装购买',
        date: new Date(Date.now() - 172800000).toISOString(),
        account: 'default'
      },
      {
        id: 'rec_005',
        type: 'expense',
        amount: 89.50,
        category: 'entertainment',
        description: '电影票',
        date: new Date(Date.now() - 259200000).toISOString(),
        account: 'default'
      }
    ];
    
    this.data.records = sampleRecords;
    this.saveToStorage();
  }
  
  /**
   * 初始化分类
   */
  initializeCategories() {
    const categories = [
      // 支出分类
      { id: 'food', name: '餐饮', icon: 'fas fa-utensils', color: '#FF3B30', type: 'expense' },
      { id: 'transport', name: '交通', icon: 'fas fa-car', color: '#007AFF', type: 'expense' },
      { id: 'shopping', name: '购物', icon: 'fas fa-shopping-bag', color: '#AF52DE', type: 'expense' },
      { id: 'entertainment', name: '娱乐', icon: 'fas fa-gamepad', color: '#34C759', type: 'expense' },
      { id: 'housing', name: '居住', icon: 'fas fa-home', color: '#FF9500', type: 'expense' },
      { id: 'medical', name: '医疗', icon: 'fas fa-heartbeat', color: '#FF2D92', type: 'expense' },
      { id: 'education', name: '教育', icon: 'fas fa-graduation-cap', color: '#5856D6', type: 'expense' },
      { id: 'other_expense', name: '其他', icon: 'fas fa-ellipsis-h', color: '#8E8E93', type: 'expense' },
      
      // 收入分类
      { id: 'salary', name: '工资', icon: 'fas fa-wallet', color: '#34C759', type: 'income' },
      { id: 'bonus', name: '奖金', icon: 'fas fa-gift', color: '#FF9500', type: 'income' },
      { id: 'investment', name: '投资', icon: 'fas fa-chart-line', color: '#007AFF', type: 'income' },
      { id: 'other_income', name: '其他', icon: 'fas fa-plus-circle', color: '#8E8E93', type: 'income' }
    ];
    
    this.data.categories = categories;
    this.saveToStorage();
  }
  
  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 导航事件
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-item') || e.target.closest('.nav-item')) {
        const navItem = e.target.closest('.nav-item');
        const page = navItem.dataset.page;
        if (page) {
          this.showPage(page);
        }
      }
    });
    
    // 浮动按钮事件
    const fab = document.querySelector('.fab');
    if (fab) {
      fab.addEventListener('click', () => {
        this.showPage('record');
      });
    }
    
    // 返回按钮事件
    document.addEventListener('click', (e) => {
      if (e.target.matches('.top-nav__back') || e.target.closest('.top-nav__back')) {
        e.preventDefault();
        this.showPage('home');
      }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
      // ESC键返回首页
      if (e.key === 'Escape') {
        this.showPage('home');
      }
    });
    
    // 窗口大小改变事件
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    
    // 页面可见性改变事件
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.refreshData();
      }
    });
    
    // 时间筛选器事件
    document.addEventListener('click', (e) => {
      if (e.target.matches('.filter-tab')) {
        this.handleTimeFilter(e.target);
      }
    });
  }
  
  /**
   * 页面切换
   * @param {string} pageId - 页面ID
   */
  showPage(pageId) {
    console.log(`📝 开始切换到页面: ${pageId}`);
    
    // 如果是相同页面，可以考虑重置图表状态
    if (pageId === this.currentPage) {
      console.log('🔄 相同页面，重置图表状态并重新初始化');
      this.resetChartInitializationStatus();
    }
    // 隐藏当前页面
    const currentPageElement = document.querySelector('.page--active');
    if (currentPageElement) {
      currentPageElement.classList.remove('page--active');
      currentPageElement.classList.add('page--slide-left');
      
      setTimeout(() => {
        currentPageElement.style.display = 'none';
        currentPageElement.classList.remove('page--slide-left');
      }, 300);
    }
    
    // 显示目标页面
    const targetPageElement = document.getElementById(pageId);
    if (targetPageElement) {
      setTimeout(() => {
        targetPageElement.style.display = 'block';
        targetPageElement.classList.add('page--active');
        
        // 更新导航状态
        this.updateNavigation(pageId);
        
        // 更新页面数据
        this.updatePageData(pageId);
        
        // 更新当前页面记录
        this.currentPage = pageId;
        
        // 触发页面显示事件
        this.onPageShow(pageId);
      }, currentPageElement ? 150 : 0);
    }
  }
  
  /**
   * 更新导航状态
   * @param {string} activePageId - 当前活跃页面ID
   */
  updateNavigation(activePageId) {
    // 更新底部导航
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('nav-item--active');
      if (item.dataset.page === activePageId) {
        item.classList.add('nav-item--active');
      }
    });
  }
  
  /**
   * 更新页面数据
   * @param {string} pageId - 页面ID
   */
  updatePageData(pageId) {
    switch (pageId) {
      case 'home':
        this.updateHomePage();
        break;
      case 'stats':
        this.updateStatsPage();
        break;
      case 'record':
        this.updateRecordPage();
        break;
      case 'settings':
        this.updateSettingsPage();
        break;
    }
  }
  
  /**
   * 重置图表初始化状态
   */
  resetChartInitializationStatus() {
    console.log('🔄 重置图表初始化状态');
    this._homeChartInitialized = false;
    this._statsChartInitialized = false;
  }
  
  /**
   * 更新年度净收支卡片
   * @param {Object} stats - 统计数据
   */
  updateBalanceCard(stats) {
    // 更新净收支金额
    const balanceValue = document.querySelector('.balance-value');
    if (balanceValue) {
      balanceValue.textContent = stats.balance.toLocaleString();
    }
    
    // 更新收入金额
    const incomeAmount = document.querySelector('.breakdown-item--income .breakdown-amount');
    if (incomeAmount) {
      incomeAmount.textContent = `¥${stats.income.toLocaleString()}`;
    }
    
    // 更新支出金额
    const expenseAmount = document.querySelector('.breakdown-item--expense .breakdown-amount');
    if (expenseAmount) {
      expenseAmount.textContent = `¥${stats.expense.toLocaleString()}`;
    }
  }
  
  /**
   * 更新首页数据
   */
  updateHomePage() {
    const stats = this.calculateStats();
    
    // 更新年度净收支卡片
    this.updateBalanceCard(stats);
    
    // 更新图表
    if (this.charts && this.charts.yearlyTrend) {
      this.updateYearlyTrendChart(stats);
    }
  }
  
  /**
   * 更新统计页面
   */
  updateStatsPage() {
    console.log('📈 更新统计页面数据');
    
    const stats = this.calculateStats();
    
    // 更新统计卡片
    this.updateStatsCards(stats);
    
    // 注意：图表初始化在onPageShow中处理，这里不重复初始化
  }
  
  /**
   * 更新记账页面
   */
  updateRecordPage() {
    console.log('📝 更新记账页面数据');
    
    // 初始化分类网格
    this.initializeCategoryGrid();
    
    // 初始化表单事件
    this.initializeRecordForm();
  }
  
  /**
   * 更新设置页面
   */
  updateSettingsPage() {
    console.log('⚙️ 更新设置页面数据');
    
    // 更新应用版本信息
    const versionElement = document.querySelector('.settings-version');
    if (versionElement) {
      versionElement.textContent = 'v1.0.0';
    }
    
    // 更新数据统计
    const stats = this.calculateStats();
    const recordCountElement = document.querySelector('.settings-records-count');
    if (recordCountElement) {
      recordCountElement.textContent = `共 ${this.data.records.length} 条记录`;
    }
  }
  
  /**
   * 更新统计卡片
   * @param {Object} stats - 统计数据
   */
  updateStatsCards(stats) {
    // 更新总收入
    const incomeElement = document.querySelector('[data-stat="income"]');
    if (incomeElement) {
      incomeElement.textContent = `¥${stats.income.toLocaleString()}`;
    }
    
    // 更新总支出
    const expenseElement = document.querySelector('[data-stat="expense"]');
    if (expenseElement) {
      expenseElement.textContent = `¥${stats.expense.toLocaleString()}`;
    }
    
    // 更新结余
    const balanceElement = document.querySelector('[data-stat="balance"]');
    if (balanceElement) {
      balanceElement.textContent = `¥${stats.balance.toLocaleString()}`;
    }
    
    // 更新日均支出
    const averageElement = document.querySelector('[data-stat="average"]');
    if (averageElement) {
      const dailyAverage = Math.round(stats.expense / 365);
      averageElement.textContent = `¥${dailyAverage.toLocaleString()}`;
    }
  }
  
  /**
   * 初始化分类网格
   */
  initializeCategoryGrid() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    // 获取当前选中的类型（收入/支出）
    const activeType = document.querySelector('.segment-option--active')?.dataset.type || 'expense';
    const categories = this.data.categories.filter(cat => cat.type === activeType);
    
    categoryGrid.innerHTML = categories.map(category => {
      return `
        <div class="category-item" data-category="${category.id}">
          <div class="category-item__icon" style="background-color: ${category.color}">
            <i class="${category.icon}"></i>
          </div>
          <div class="category-item__name">${category.name}</div>
        </div>
      `;
    }).join('');
    
    // 添加点击事件
    categoryGrid.addEventListener('click', (e) => {
      const categoryItem = e.target.closest('.category-item');
      if (categoryItem) {
        // 移除其他选中状态
        categoryGrid.querySelectorAll('.category-item').forEach(item => {
          item.classList.remove('category-item--active');
        });
        
        // 添加当前选中状态
        categoryItem.classList.add('category-item--active');
        
        // 保存选中的分类
        const categoryId = categoryItem.dataset.category;
        console.log('🏷️ 选中分类:', categoryId);
      }
    });
  }
  
  /**
   * 初始化记账表单
   */
  initializeRecordForm() {
    // 初始化收支类型切换
    const segmentOptions = document.querySelectorAll('.segment-option');
    segmentOptions.forEach(option => {
      option.addEventListener('click', () => {
        // 更新按钮状态
        segmentOptions.forEach(opt => opt.classList.remove('segment-option--active'));
        option.classList.add('segment-option--active');
        
        // 重新初始化分类网格
        this.initializeCategoryGrid();
      });
    });
    
    // 初始化快捷金额按钮
    const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
    quickAmountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = btn.dataset.amount;
        const amountInput = document.getElementById('amountInput');
        if (amountInput) {
          amountInput.value = amount;
        }
      });
    });
    
    // 初始化保存按钮
    const saveBtn = document.getElementById('saveRecord');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveRecord();
      });
    }
  }
  
  /**
   * 保存记录
   */
  saveRecord() {
    const amountInput = document.getElementById('amountInput');
    const noteInput = document.getElementById('noteInput');
    const activeCategory = document.querySelector('.category-item--active');
    const activeType = document.querySelector('.segment-option--active');
    
    if (!amountInput?.value || !activeCategory || !activeType) {
      console.warn('⚠️ 请填写完整信息');
      return;
    }
    
    const record = {
      id: 'rec_' + Date.now(),
      type: activeType.dataset.type,
      amount: parseFloat(amountInput.value),
      category: activeCategory.dataset.category,
      description: noteInput?.value || '无备注',
      date: new Date().toISOString(),
      account: 'default'
    };
    
    // 添加到数据中
    this.data.records.push(record);
    this.saveToStorage();
    
    console.log('✅ 记录保存成功:', record);
    
    // 清空表单
    amountInput.value = '';
    if (noteInput) noteInput.value = '';
    document.querySelectorAll('.category-item').forEach(item => {
      item.classList.remove('category-item--active');
    });
    
    // 返回首页
    this.showPage('home');
  }
  
  /**
   * 更新最近记录
   */
  updateRecentRecords() {
    const container = document.querySelector('.records-section .record-list');
    if (!container) return;
    
    const recentRecords = this.data.records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    container.innerHTML = recentRecords.map(record => {
      const category = this.getCategoryById(record.category);
      const isIncome = record.type === 'income';
      const amountClass = isIncome ? 'record-card__amount--income' : 'record-card__amount--expense';
      const amountSign = isIncome ? '+' : '-';
      
      return `
        <div class="record-card" data-record-id="${record.id}">
          <div class="record-card__icon" style="background-color: ${category.color}">
            <i class="${category.icon}"></i>
          </div>
          <div class="record-card__info">
            <h3 class="record-card__title">${record.description}</h3>
            <p class="record-card__meta">${this.formatDate(record.date)}</p>
          </div>
          <div class="record-card__amount ${amountClass}">
            ${amountSign}¥${record.amount.toFixed(0)}
          </div>
        </div>
      `;
    }).join('');
  }
  
  /**
   * 计算统计数据
   * @returns {Object} 统计数据
   */
  calculateStats() {
    // 计算2024年度数据
    const thisYear = new Date().getFullYear();
    const startOfYear = new Date(thisYear, 0, 1);
    const endOfYear = new Date(thisYear, 11, 31);
    
    // 使用模拟的年度数据
    const yearlyIncome = 486800;  // 年度总收入
    const yearlyExpense = 328240; // 年度总支出
    
    return {
      income: yearlyIncome,
      expense: yearlyExpense,
      balance: yearlyIncome - yearlyExpense,
      records: this.data.records || []
    };
  }
  
  /**
   * 页面显示回调
   * @param {string} pageId - 页面ID
   */
  onPageShow(pageId) {
    console.log(`📝 页面显示: ${pageId}`);
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('pageShow', {
      detail: { pageId, app: this }
    }));
    
    // 页面特定的初始化
    switch (pageId) {
      case 'home':
        // 初始化年度收支趋势图表
        if (window.chartManager) {
          // 防止重复初始化
          if (this._homeChartInitialized) {
            console.log('🔄 首页图表已初始化，跳过');
            return;
          }
          
          setTimeout(() => {
            console.log('🏠 手动初始化首页图表');
            const canvas = document.getElementById('yearlyTrendChart');
            if (canvas) {
              console.log('✅ 找到年度趋势图表元素');
              
              try {
                const chart = window.chartManager.initializeYearlyTrendChart();
                if (chart) {
                  this._homeChartInitialized = true;
                  console.log('✅ 首页图表初始化成功');
                } else {
                  console.error('❌ 首页图表初始化返回空值');
                }
              } catch (error) {
                console.error('❌ 首页图表初始化异常:', error);
                this._homeChartInitialized = false;
              }
            } else {
              console.error('⚠️ 未找到年度趋势图表元素: yearlyTrendChart');
            }
          }, 500);
        } else {
          console.error('⚠️ 图表管理器未初始化');
        }
        break;
      case 'stats':
        // 初始化统计页面图表
        if (window.chartManager) {
          // 防止重复初始化
          if (this._statsChartInitialized) {
            console.log('🔄 统计页面图表已初始化，跳过');
            return;
          }
          
          setTimeout(() => {
            console.log('📊 手动初始化统计页面图表');
            let successCount = 0;
            let totalCharts = 2;
            
            const trendCanvas = document.getElementById('trendChart');
            const categoryCanvas = document.getElementById('categoryChart');
            
            if (trendCanvas) {
              console.log('✅ 找到趋势图表元素');
              try {
                const trendChart = window.chartManager.initializeTrendChart();
                if (trendChart) {
                  successCount++;
                  console.log('✅ 趋势图表初始化成功');
                }
              } catch (error) {
                console.error('❌ 趋势图表初始化异常:', error);
              }
            } else {
              console.error('⚠️ 未找到趋势图表元素: trendChart');
            }
            
            if (categoryCanvas) {
              console.log('✅ 找到分类图表元素');
              try {
                const categoryChart = window.chartManager.initializeCategoryChart();
                if (categoryChart) {
                  successCount++;
                  console.log('✅ 分类图表初始化成功');
                }
              } catch (error) {
                console.error('❌ 分类图表初始化异常:', error);
              }
            } else {
              console.error('⚠️ 未找到分类图表元素: categoryChart');
            }
            
            // 只有当所有图表都成功初始化时才标记为已初始化
            if (successCount === totalCharts) {
              this._statsChartInitialized = true;
              console.log('✅ 统计页面所有图表初始化成功');
            } else {
              console.warn(`⚠️ 统计页面图表初始化部分失败: ${successCount}/${totalCharts}`);
            }
            
            this.updateStatsData();
          }, 500);
        } else {
          console.error('⚠️ 图表管理器未初始化');
        }
        break;
    }
  }
  
  /**
   * 更新统计数据
   */
  updateStatsData() {
    console.log('📈 更新统计数据');
    const stats = this.calculateStats();
    this.updateStatsCards(stats);
  }
  
  /**
   * 根据ID获取分类
   * @param {string} categoryId - 分类ID
   * @returns {Object} 分类对象
   */
  getCategoryById(categoryId) {
    return this.data.categories.find(cat => cat.id === categoryId) || {
      id: 'unknown',
      name: '未知分类',
      icon: 'fas fa-question',
      color: '#8E8E93'
    };
  }
  
  /**
   * 格式化日期
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化后的日期
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '今天';
    } else if (diffDays === 2) {
      return '昨天';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric'
      });
    }
  }
  
  /**
   * 刷新数据
   */
  refreshData() {
    this.loadFromStorage();
    this.updatePageData(this.currentPage);
  }
  
  /**
   * 从本地存储加载数据
   */
  loadFromStorage() {
    try {
      const storedData = localStorage.getItem('financeAppData');
      if (storedData) {
        this.data = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  }
  
  /**
   * 保存数据到本地存储
   */
  saveToStorage() {
    try {
      localStorage.setItem('financeAppData', JSON.stringify(this.data));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }
  
  /**
   * 根据ID获取分类信息
   * @param {string} categoryId - 分类ID
   * @returns {Object} 分类信息
   */
  getCategoryById(categoryId) {
    return this.data.categories.find(cat => cat.id === categoryId) || 
           { name: '其他', icon: 'fas fa-question', color: '#8E8E93' };
  }
  
  /**
   * 格式化日期
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化后的日期
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  }
  
  /**
   * 更新统计页面数据
   */
  updateStatsData() {
    // 模拟统计数据（近6个月）
    const statsData = {
      income: 240000,     // 近6个月总收入
      expense: 174500,    // 近6个月总支出
      balance: 65500,     // 近6个月结余
      average: 966       // 日均支出
    };

    // 更新统计卡片
    this.updateStatCard('income', statsData.income, '+15.2%');
    this.updateStatCard('expense', statsData.expense, '-8.3%');
    this.updateStatCard('balance', statsData.balance, '+28.7%');
    this.updateStatCard('average', statsData.average, '每天');
  }

  /**
   * 更新统计卡片
   * @param {string} type - 统计类型
   * @param {number} value - 数值
   * @param {string} trend - 趋势文本
   */
  updateStatCard(type, value, trend) {
    const valueElement = document.querySelector(`[data-stat="${type}"]`);
    if (valueElement) {
      const formattedValue = type === 'average' 
        ? `¥${value}` 
        : `¥${value.toLocaleString()}`;
      valueElement.textContent = formattedValue;
      
      // 添加更新动画
      valueElement.style.transform = 'scale(1.05)';
      setTimeout(() => {
        valueElement.style.transform = 'scale(1)';
      }, 200);
    }

    // 更新趋势指示器
    const trendElement = valueElement?.closest('.stat-card').querySelector('.stat-card__trend span');
    if (trendElement) {
      trendElement.textContent = trend;
    }
  }
  
  /**
   * 处理时间筛选器
   * @param {Element} filterElement - 筛选器元素
   */
  handleTimeFilter(filterElement) {
    // 更新按钮状态
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('filter-tab--active');
    });
    filterElement.classList.add('filter-tab--active');
    
    // 获取筛选器类型
    const period = filterElement.dataset.period;
    
    // 根据时间周期更新数据
    this.updateDataByPeriod(period);
    
    // 重新初始化图表
    if (window.chartManager) {
      setTimeout(() => {
        window.chartManager.initializeTrendChart();
        window.chartManager.initializeCategoryChart();
      }, 100);
    }
  }
  
  /**
   * 根据时间周期更新数据
   * @param {string} period - 时间周期
   */
  updateDataByPeriod(period) {
    let statsData;
    
    switch (period) {
      case 'month':
        statsData = {
          income: 43000,
          expense: 30000,
          balance: 13000,
          average: 1000
        };
        break;
      case 'quarter':
        statsData = {
          income: 125000,
          expense: 89000,
          balance: 36000,
          average: 988
        };
        break;
      case 'half':
        statsData = {
          income: 240000,
          expense: 174500,
          balance: 65500,
          average: 966
        };
        break;
      case 'year':
        statsData = {
          income: 486800,
          expense: 328240,
          balance: 158560,
          average: 900
        };
        break;
      default:
        return;
    }
    
    // 更新统计卡片
    this.updateStatCard('income', statsData.income, '+15.2%');
    this.updateStatCard('expense', statsData.expense, '-8.3%');
    this.updateStatCard('balance', statsData.balance, '+28.7%');
    this.updateStatCard('average', statsData.average, '每天');
  }
  
  /**
   * 更新统计卡片
   * @param {string} statId - 统计ID
   * @param {number} value - 数值
   * @param {string} trend - 趋势
   */
  updateStatCard(statId, value, trend) {
    const valueElement = document.querySelector(`[data-stat="${statId}"]`);
    if (valueElement) {
      valueElement.textContent = typeof value === 'number' ? `¥${value.toLocaleString()}` : value;
    }
    
    const trendElement = valueElement?.parentElement?.querySelector('.stat-card__trend span');
    if (trendElement && trend) {
      trendElement.textContent = trend;
    }
  }
  
  /**
   * 从本地存储加载数据
   */
  loadFromStorage() {
    try {
      const storedData = localStorage.getItem('financeAppData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.data = { ...this.data, ...parsedData };
        console.log('✅ 从本地存储加载数据成功');
      }
    } catch (error) {
      console.error('❌ 加载本地存储数据失败:', error);
    }
  }
  
  /**
   * 保存数据到本地存储
   */
  saveToStorage() {
    try {
      localStorage.setItem('financeAppData', JSON.stringify(this.data));
      console.log('✅ 数据保存到本地存储成功');
    } catch (error) {
      console.error('❌ 保存数据到本地存储失败:', error);
    }
  }
  
  /**
   * 窗口大小改变处理
   */
  handleResize() {
    // 重新调整图表大小
    if (window.chartManager) {
      Object.values(window.chartManager.charts || {}).forEach(chart => {
        if (chart && chart.resize) {
          chart.resize();
        }
      });
    }
  }
  
  /**
   * 刷新数据
   */
  refreshData() {
    this.loadFromStorage();
    this.updatePageData(this.currentPage);
  }
  
  /**
   * 显示提示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 (success, error, info)
   */
  showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
      toast.classList.add('toast--visible');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// 全局应用实例
let app;

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 开始初始化记账应用...');
  
  app = new FinanceApp();
  
  // 将应用实例挂载到全局，方便调试和图表组件访问
  window.FinanceApp = app;
  window.financeApp = app;  // 添加这个供图表组件使用
  
  console.log('✅ 记账应用初始化完成');
});

// 导出应用类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinanceApp;
}