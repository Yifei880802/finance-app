/**
 * 表单组件管理
 * 处理记账表单的交互逻辑和验证
 * Author: 开发团队
 * Version: 1.0.0
 */

class FormManager {
  constructor() {
    this.currentType = 'expense';
    this.selectedCategory = null;
    this.amount = 0;
    this.description = '';
    
    this.init();
  }

  /**
   * 初始化表单管理器
   */
  init() {
    this.setupEventListeners();
    this.renderCategories();
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 收支类型切换
    document.addEventListener('click', (e) => {
      if (e.target.matches('.segment-option')) {
        this.handleTypeSwitch(e.target);
      }
    });

    // 快捷金额按钮
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quick-amount-btn')) {
        const amount = parseFloat(e.target.dataset.amount);
        this.setAmount(amount);
      }
    });

    // 分类选择
    document.addEventListener('click', (e) => {
      if (e.target.matches('.category-item') || e.target.closest('.category-item')) {
        const categoryItem = e.target.closest('.category-item');
        this.selectCategory(categoryItem.dataset.categoryId);
      }
    });

    // 金额输入
    const amountInput = document.getElementById('amountInput');
    if (amountInput) {
      amountInput.addEventListener('input', (e) => {
        this.handleAmountInput(e.target.value);
      });

      amountInput.addEventListener('blur', (e) => {
        this.formatAmountInput(e.target);
      });
    }

    // 备注输入
    const noteInput = document.getElementById('noteInput');
    if (noteInput) {
      noteInput.addEventListener('input', (e) => {
        this.description = e.target.value;
      });
    }

    // 保存记录
    const saveBtn = document.getElementById('saveRecord');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveRecord();
      });
    }

    // 表单验证
    document.addEventListener('input', (e) => {
      if (e.target.matches('#amountInput, #noteInput')) {
        this.validateForm();
      }
    });
  }

  /**
   * 处理收支类型切换
   * @param {HTMLElement} target - 被点击的元素
   */
  handleTypeSwitch(target) {
    // 移除所有激活状态
    document.querySelectorAll('.segment-option').forEach(option => {
      option.classList.remove('segment-option--active');
    });

    // 激活当前选项
    target.classList.add('segment-option--active');
    
    // 更新类型
    this.currentType = target.dataset.type;
    
    // 重新渲染分类
    this.renderCategories();
    
    // 重置选中的分类
    this.selectedCategory = null;
    
    // 添加切换动画
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
    }, 150);
  }

  /**
   * 渲染分类网格
   */
  renderCategories() {
    const container = document.getElementById('categoryGrid');
    if (!container) return;

    // 获取当前类型的分类
    const categories = this.getCategories(this.currentType);
    
    container.innerHTML = categories.map(category => `
      <div class="category-item u-bg-secondary u-rounded-xl u-flex u-flex-col u-items-center u-justify-center u-p-md u-transition u-cursor-pointer" 
           data-category-id="${category.id}">
        <i class="${category.icon} u-text-2xl u-mb-xs" style="color: ${category.color}"></i>
        <span class="u-text-sm">${category.name}</span>
      </div>
    `).join('');

    // 添加进入动画
    container.querySelectorAll('.category-item').forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  /**
   * 获取分类数据
   * @param {string} type - 分类类型 (income/expense)
   * @returns {Array} 分类数组
   */
  getCategories(type) {
    const app = window.FinanceApp;
    if (app && app.data && app.data.categories) {
      return app.data.categories.filter(cat => cat.type === type);
    }

    // 默认分类数据
    const defaultCategories = {
      expense: [
        { id: 'food', name: '餐饮', icon: 'fas fa-utensils', color: '#FF3B30' },
        { id: 'transport', name: '交通', icon: 'fas fa-car', color: '#007AFF' },
        { id: 'shopping', name: '购物', icon: 'fas fa-shopping-bag', color: '#AF52DE' },
        { id: 'entertainment', name: '娱乐', icon: 'fas fa-gamepad', color: '#34C759' },
        { id: 'housing', name: '居住', icon: 'fas fa-home', color: '#FF9500' },
        { id: 'medical', name: '医疗', icon: 'fas fa-heartbeat', color: '#FF2D92' },
        { id: 'education', name: '教育', icon: 'fas fa-graduation-cap', color: '#5856D6' },
        { id: 'other', name: '其他', icon: 'fas fa-ellipsis-h', color: '#8E8E93' }
      ],
      income: [
        { id: 'salary', name: '工资', icon: 'fas fa-wallet', color: '#34C759' },
        { id: 'bonus', name: '奖金', icon: 'fas fa-gift', color: '#FF9500' },
        { id: 'investment', name: '投资', icon: 'fas fa-chart-line', color: '#007AFF' },
        { id: 'other_income', name: '其他', icon: 'fas fa-plus-circle', color: '#8E8E93' }
      ]
    };

    return defaultCategories[type] || [];
  }

  /**
   * 选择分类
   * @param {string} categoryId - 分类ID
   */
  selectCategory(categoryId) {
    // 移除之前的选中状态
    document.querySelectorAll('.category-item').forEach(item => {
      item.classList.remove('category-item--selected');
    });

    // 添加选中状态
    const selectedItem = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (selectedItem) {
      selectedItem.classList.add('category-item--selected');
      
      // 添加选中动画
      selectedItem.style.transform = 'scale(0.9)';
      setTimeout(() => {
        selectedItem.style.transform = 'scale(1)';
      }, 100);
    }

    this.selectedCategory = categoryId;
    this.validateForm();
  }

  /**
   * 设置金额
   * @param {number} amount - 金额
   */
  setAmount(amount) {
    this.amount = amount;
    
    const input = document.getElementById('amountInput');
    if (input) {
      input.value = amount.toFixed(2);
      this.formatAmountInput(input);
      
      // 添加动画效果
      input.style.transform = 'scale(1.05)';
      setTimeout(() => {
        input.style.transform = 'scale(1)';
      }, 200);
    }
    
    this.validateForm();
  }

  /**
   * 处理金额输入
   * @param {string} value - 输入值
   */
  handleAmountInput(value) {
    // 只允许数字和小数点
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // 限制小数位数
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      parts.splice(2);
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
    }
    
    const formattedValue = parts.join('.');
    this.amount = parseFloat(formattedValue) || 0;
    
    // 更新输入框值
    const input = document.getElementById('amountInput');
    if (input && input.value !== formattedValue) {
      input.value = formattedValue;
    }
    
    this.validateForm();
  }

  /**
   * 格式化金额输入框
   * @param {HTMLElement} input - 输入框元素
   */
  formatAmountInput(input) {
    const value = parseFloat(input.value) || 0;
    if (value > 0) {
      input.value = value.toFixed(2);
    }
  }

  /**
   * 验证表单
   * @returns {boolean} 表单是否有效
   */
  validateForm() {
    const isValid = this.amount > 0 && this.selectedCategory;
    
    // 更新保存按钮状态
    const saveBtn = document.getElementById('saveRecord');
    if (saveBtn) {
      saveBtn.disabled = !isValid;
      saveBtn.style.opacity = isValid ? '1' : '0.5';
    }
    
    return isValid;
  }

  /**
   * 保存记录
   */
  saveRecord() {
    if (!this.validateForm()) {
      this.showValidationError();
      return;
    }

    const record = {
      id: 'rec_' + Date.now(),
      type: this.currentType,
      amount: this.amount,
      category: this.selectedCategory,
      description: this.description || this.getDefaultDescription(),
      date: new Date().toISOString(),
      account: 'default'
    };

    // 保存到应用数据
    const app = window.FinanceApp;
    if (app) {
      app.data.records.push(record);
      app.saveToStorage();
      
      // 显示成功消息
      app.showToast('记录已保存', 'success');
      
      // 重置表单
      this.resetForm();
      
      // 返回首页
      setTimeout(() => {
        app.showPage('home');
      }, 1000);
    }
  }

  /**
   * 获取默认描述
   * @returns {string} 默认描述
   */
  getDefaultDescription() {
    const category = this.getCategories(this.currentType)
      .find(cat => cat.id === this.selectedCategory);
    return category ? category.name : '未分类';
  }

  /**
   * 显示验证错误
   */
  showValidationError() {
    let message = '';
    
    if (this.amount <= 0) {
      message = '请输入有效金额';
    } else if (!this.selectedCategory) {
      message = '请选择分类';
    }
    
    const app = window.FinanceApp;
    if (app) {
      app.showToast(message, 'error');
    }
  }

  /**
   * 重置表单
   */
  resetForm() {
    // 重置数据
    this.amount = 0;
    this.selectedCategory = null;
    this.description = '';
    
    // 重置输入框
    const amountInput = document.getElementById('amountInput');
    if (amountInput) {
      amountInput.value = '';
    }
    
    const noteInput = document.getElementById('noteInput');
    if (noteInput) {
      noteInput.value = '';
    }
    
    // 重置分类选择
    document.querySelectorAll('.category-item').forEach(item => {
      item.classList.remove('category-item--selected');
    });
    
    // 重置类型为支出
    this.currentType = 'expense';
    document.querySelectorAll('.segment-option').forEach(option => {
      option.classList.remove('segment-option--active');
    });
    document.querySelector('[data-type="expense"]')?.classList.add('segment-option--active');
    
    // 重新渲染分类
    this.renderCategories();
    
    // 重置验证状态
    this.validateForm();
  }

  /**
   * 预填充表单数据
   * @param {Object} record - 记录数据
   */
  populateForm(record) {
    this.currentType = record.type;
    this.amount = record.amount;
    this.selectedCategory = record.category;
    this.description = record.description;
    
    // 更新UI
    document.querySelector(`[data-type="${record.type}"]`)?.click();
    
    setTimeout(() => {
      this.setAmount(record.amount);
      this.selectCategory(record.category);
      
      const noteInput = document.getElementById('noteInput');
      if (noteInput) {
        noteInput.value = record.description;
      }
    }, 300);
  }
}

// 全局表单管理器实例
let formManager;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  formManager = new FormManager();
  
  // 将实例挂载到全局
  window.formManager = formManager;
});

// 导出表单管理器类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormManager;
}