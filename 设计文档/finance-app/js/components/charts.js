/**
 * 图表组件
 * 封装Chart.js图表的创建和管理
 * Author: 开发团队
 * Version: 1.0.0
 */

class ChartManager {
  constructor() {
    this.charts = {};
    this.defaultColors = {
      primary: '#667eea',
      secondary: '#764ba2',
      income: '#60a5fa',
      expense: '#f97316',
      balance: '#4ade80',
      success: '#34C759',
      warning: '#FF3B30',
      info: '#AF52DE',
      gray: '#8E8E93'
    };
  }

  /**
   * 初始化年度收支趋势图表
   */
  initializeYearlyTrendChart() {
    console.log('📈 开始初始化年度趋势图表...');
    
    // 添加调用栈信息供调试
    try {
      const stack = new Error().stack;
      console.log('🔍 调用栈:', stack?.split('\n').slice(1, 4).join('\n'));
    } catch (e) {
      // 忽略调用栈错误
    }
    
    const canvas = document.getElementById('yearlyTrendChart');
    if (!canvas) {
      console.error('⚠️ 未找到年度趋势图表元素: yearlyTrendChart');
      return null;
    }
    
    // 检查Chart.js是否可用（增强版本，兼容模拟模式）
    if (typeof Chart === 'undefined') {
      const errorMsg = '⚠️ Chart.js 库未加载！';
      console.error(errorMsg);
      console.log([errorMsg]); // 这是用户看到的错误格式
      return null;
    }
    
    if (!Chart.version) {
      const errorMsg = '⚠️ Chart.js 库加载不完整！';
      console.error(errorMsg);
      console.log([errorMsg]);
      return null;
    }
    
    // 检查是否为模拟模式
    const isMockMode = Chart.version && Chart.version.includes('mock');
    if (isMockMode) {
      console.log('🎨 模拟模式下创建年度趋势图表');
    } else {
      console.log('✅ Chart.js库可用，版本:', Chart.version);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('⚠️ 无法获取画布上下文');
      return null;
    }
    
    console.log('✅ 画布元素已找到，开始创建图表...');
    
    // 销毁现有图表
    if (this.charts.yearlyTrend) {
      console.log('🗑️ 销毁现有年度趋势图表');
      try {
        this.charts.yearlyTrend.destroy();
      } catch (error) {
        console.warn('⚠️ 销毁现有图表时出错:', error.message);
      }
    }

    // 生成2024年度模拟数据
    const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    
    // 收入数据 - 模拟80后的收入水平
    const incomeData = [
      38000, 42000, 39000, 41000, 38500, 40000,
      42500, 41000, 39500, 43000, 41500, 40000
    ];
    
    // 支出数据 - 模拟实际支出情况
    const expenseData = [
      25000, 32000, 28000, 29500, 26000, 27500,
      31000, 28500, 27000, 30000, 29000, 28240
    ];
    
    // 净收支数据
    const balanceData = incomeData.map((income, index) => income - expenseData[index]);

    try {
      this.charts.yearlyTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: '收入',
            data: incomeData,
            borderColor: this.defaultColors.income,
            backgroundColor: this.createGradient(ctx, this.defaultColors.income),
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: this.defaultColors.income,
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3
          },
          {
            label: '支出',
            data: expenseData,
            borderColor: this.defaultColors.expense,
            backgroundColor: this.createGradient(ctx, this.defaultColors.expense),
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: this.defaultColors.expense,
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3
          },
          {
            label: '净收支',
            data: balanceData,
            borderColor: this.defaultColors.balance,
            backgroundColor: this.createAreaGradient(ctx, this.defaultColors.balance),
            borderWidth: 4,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: this.defaultColors.balance,
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
              color: '#FFFFFF',
              font: {
                size: 14,
                weight: '500',
                family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              boxWidth: 12,
              boxHeight: 12
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 12,
            titleFont: {
              size: 14,
              weight: '600'
            },
            bodyFont: {
              size: 13,
              weight: '500'
            },
            padding: 12,
            displayColors: true,
            callbacks: {
              title: function(context) {
                return `2024年 ${context[0].label}`;
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return `${label}: ¥${value.toLocaleString()}`;
              },
              afterBody: function(context) {
                if (context.length === 3) {
                  const income = context.find(c => c.dataset.label === '收入')?.parsed.y || 0;
                  const expense = context.find(c => c.dataset.label === '支出')?.parsed.y || 0;
                  const balance = income - expense;
                  const rate = expense > 0 ? ((balance / income) * 100).toFixed(1) : 0;
                  return [`储蓄率: ${rate}%`];
                }
                return [];
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              color: '#B8BCC8',
              font: {
                size: 12,
                weight: '500'
              },
              padding: 8
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              color: '#B8BCC8',
              font: {
                size: 12,
                weight: '500'
              },
              padding: 8,
              callback: function(value) {
                return '¥' + (value / 1000).toFixed(0) + 'k';
              }
            },
            beginAtZero: false
          }
        },
        animation: {
          duration: 1800,
          easing: 'easeOutCubic',
          delay: (context) => {
            return context.type === 'data' && context.mode === 'default'
              ? context.dataIndex * 50
              : 0;
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          line: {
            borderJoinStyle: 'round',
            borderCapStyle: 'round'
          }
        }
      }
    });

    console.log('✅ 年度趋势图表创建成功！');
    return this.charts.yearlyTrend;
    
    } catch (error) {
      console.error('❌ 年度趋势图表创建失败:', error);
      console.error('错误详情:', {
        message: error.message,
        stack: error.stack,
        canvasElement: !!canvas,
        chartJsLoaded: typeof Chart !== 'undefined',
        contextAvailable: !!ctx
      });
      
      // 清理失败的图表实例
      if (this.charts.yearlyTrend) {
        try {
          this.charts.yearlyTrend.destroy();
        } catch (destroyError) {
          console.warn('清理失败图表时出错:', destroyError.message);
        }
        delete this.charts.yearlyTrend;
      }
      
      return null;
    }
  }

  /**
   * 初始化环形图表
   */
  initializeDoughnutChart() {
    const canvas = document.getElementById('doughnutChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 销毁现有图表
    if (this.charts.doughnut) {
      this.charts.doughnut.destroy();
    }

    // 获取统计数据
    const stats = window.financeApp?.calculateStats() || {
      income: 456800,
      expense: 328240
    };

    this.charts.doughnut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['收入', '支出'],
        datasets: [{
          data: [stats.income, stats.expense],
          backgroundColor: [
            this.defaultColors.income,
            this.defaultColors.expense
          ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(44, 44, 44, 0.95)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ¥${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutCubic'
        }
      }
    });

    return this.charts.doughnut;
  }

  /**
   * 初始化趋势图表（统计页面用）
   */
  initializeTrendChart() {
    console.log('📈 开始初始化统计页面趋势图表...');
    
    const canvas = document.getElementById('trendChart');
    if (!canvas) {
      console.error('⚠️ 未找到趋势图表元素: trendChart');
      return null;
    }
    
    // 检查Chart.js是否可用（增强版本）
    if (typeof Chart === 'undefined') {
      const errorMsg = '⚠️ Chart.js 库未加载！';
      console.error(errorMsg);
      console.log([errorMsg]); // 这是用户看到的错误格式
      return null;
    }
    
    if (!Chart.version) {
      const errorMsg = '⚠️ Chart.js 库加载不完整！';
      console.error(errorMsg);
      console.log([errorMsg]);
      return null;
    }
    
    console.log('✅ Chart.js库可用，版本:', Chart.version);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('⚠️ 无法获取画布上下文');
      return null;
    }
    
    console.log('✅ 趋势图表画布元素已找到，开始创建图表...');
    
    // 销毁现有图表
    if (this.charts.trend) {
      console.log('🗑️ 销毁现有趋势图表');
      this.charts.trend.destroy();
    }

    // 生成近6个月的模拟数据
    const labels = ['7月', '8月', '9月', '10月', '11月', '12月'];
    const incomeData = [39500, 41000, 38000, 42500, 40000, 43000];
    const expenseData = [27000, 28500, 26000, 31000, 29000, 30000];
    const balanceData = incomeData.map((income, index) => income - expenseData[index]);

    this.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '收入',
            data: incomeData,
            borderColor: this.defaultColors.income,
            backgroundColor: this.createGradient(ctx, this.defaultColors.income),
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: this.defaultColors.income,
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3
          },
          {
            label: '支出',
            data: expenseData,
            borderColor: this.defaultColors.expense,
            backgroundColor: this.createGradient(ctx, this.defaultColors.expense),
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: this.defaultColors.expense,
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3
          },
          {
            label: '净收支',
            data: balanceData,
            borderColor: this.defaultColors.balance,
            backgroundColor: this.createAreaGradient(ctx, this.defaultColors.balance),
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: this.defaultColors.balance,
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
              color: '#FFFFFF',
              font: {
                size: 13,
                weight: '500',
                family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              boxWidth: 10,
              boxHeight: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 10,
            titleFont: {
              size: 13,
              weight: '600'
            },
            bodyFont: {
              size: 12,
              weight: '500'
            },
            padding: 10,
            displayColors: true,
            callbacks: {
              title: function(context) {
                return `2024年 ${context[0].label}`;
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return `${label}: ¥${value.toLocaleString()}`;
              },
              afterBody: function(context) {
                if (context.length >= 2) {
                  const income = context.find(c => c.dataset.label === '收入')?.parsed.y || 0;
                  const expense = context.find(c => c.dataset.label === '支出')?.parsed.y || 0;
                  if (income > 0) {
                    const rate = (((income - expense) / income) * 100).toFixed(1);
                    return [`储蓄率: ${rate}%`];
                  }
                }
                return [];
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              color: '#B8BCC8',
              font: {
                size: 11,
                weight: '500'
              },
              padding: 6
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              color: '#B8BCC8',
              font: {
                size: 11,
                weight: '500'
              },
              padding: 6,
              callback: function(value) {
                return '¥' + (value / 1000).toFixed(0) + 'k';
              }
            },
            beginAtZero: false
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutCubic',
          delay: (context) => {
            return context.type === 'data' && context.mode === 'default'
              ? context.dataIndex * 80
              : 0;
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          line: {
            borderJoinStyle: 'round',
            borderCapStyle: 'round'
          }
        }
      }
    });

    console.log('✅ 统计页面趋势图表创建成功！');
    return this.charts.trend;
  }

  /**
   * 初始化分类统计环形图
   */
  initializeCategoryChart() {
    console.log('📈 开始初始化分类统计图表...');
    
    const canvas = document.getElementById('categoryChart');
    if (!canvas) {
      console.error('⚠️ 未找到分类图表元素: categoryChart');
      return null;
    }
    
    // 检查Chart.js是否可用（增强版本）
    if (typeof Chart === 'undefined') {
      const errorMsg = '⚠️ Chart.js 库未加载！';
      console.error(errorMsg);
      console.log([errorMsg]); // 这是用户看到的错误格式
      return null;
    }
    
    if (!Chart.version) {
      const errorMsg = '⚠️ Chart.js 库加载不完整！';
      console.error(errorMsg);
      console.log([errorMsg]);
      return null;
    }
    
    console.log('✅ Chart.js库可用，版本:', Chart.version);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('⚠️ 无法获取分类图表画布上下文');
      return null;
    }
    
    console.log('✅ 分类图表画布元素已找到，开始创建图表...');
    
    // 销毁现有图表
    if (this.charts.category) {
      console.log('🗑️ 销毁现有分类图表');
      this.charts.category.destroy();
    }

    // 模拟分类数据（按支出金额排序）
    const categoryData = [
      { label: '餐饮', value: 8500, color: '#FF3B30', percentage: 32.1 },
      { label: '交通', value: 6800, color: '#007AFF', percentage: 25.7 },
      { label: '购物', value: 5200, color: '#AF52DE', percentage: 19.6 },
      { label: '娱乐', value: 3500, color: '#34C759', percentage: 13.2 },
      { label: '居住', value: 2440, color: '#FF9500', percentage: 9.4 }
    ];

    this.charts.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryData.map(item => item.label),
        datasets: [{
          data: categoryData.map(item => item.value),
          backgroundColor: categoryData.map(item => item.color),
          borderWidth: 0,
          hoverBorderWidth: 3,
          hoverBorderColor: '#FFFFFF',
          borderRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 10,
            titleFont: {
              size: 13,
              weight: '600'
            },
            bodyFont: {
              size: 12,
              weight: '500'
            },
            padding: 10,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return [`${label}: ¥${value.toLocaleString()}`, `占比: ${percentage}%`];
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          duration: 1200,
          easing: 'easeOutCubic'
        },
        onHover: (event, activeElements) => {
          event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
        }
      }
    });

    // 生成分类统计列表
    this.generateCategoryStats(categoryData);

    console.log('✅ 分类统计图表创建成功！');
    return this.charts.category;
  }

  /**
   * 生成分类统计列表
   * @param {Array} categoryData - 分类数据
   */
  generateCategoryStats(categoryData) {
    const container = document.getElementById('categoryStats');
    if (!container) return;

    const total = categoryData.reduce((sum, item) => sum + item.value, 0);

    container.innerHTML = `
      <div class="category-legend">
        ${categoryData.map(item => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return `
            <div class="category-legend__item">
              <div class="category-legend__color" style="background-color: ${item.color}"></div>
              <div class="category-legend__info">
                <div class="category-legend__label">${item.label}</div>
                <div class="category-legend__value">¥${item.value.toLocaleString()} (${percentage}%)</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="category-summary">
        <div class="category-summary__total">
          <span class="category-summary__label">本月总支出</span>
          <span class="category-summary__value">¥${total.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  /**
   * 更新环形图表数据
   * @param {Object} stats - 统计数据
   */
  updateDoughnutChart(stats) {
    if (!this.charts.doughnut) return;

    this.charts.doughnut.data.datasets[0].data = [stats.income, stats.expense];
    this.charts.doughnut.update('active');

    // 更新中心显示的数值
    const centerValue = document.querySelector('.chart-center__value');
    if (centerValue) {
      centerValue.textContent = `¥${stats.balance.toLocaleString()}`;
      centerValue.style.color = stats.balance >= 0 ? this.defaultColors.success : this.defaultColors.warning;
    }
  }

  /**
   * 创建渐变背景
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {string} color - 基础颜色
   * @returns {CanvasGradient} 渐变对象
   */
  createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color + '40');  // 25% 透明度
    gradient.addColorStop(1, color + '00');  // 完全透明
    return gradient;
  }

  /**
   * 创建面积渐变背景
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {string} color - 基础颜色
   * @returns {CanvasGradient} 渐变对象
   */
  createAreaGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color + '60');  // 40% 透明度
    gradient.addColorStop(0.6, color + '20'); // 12% 透明度
    gradient.addColorStop(1, color + '05');  // 3% 透明度
    return gradient;
  }

  /**
   * 销毁所有图表
   */
  destroyAllCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  /**
   * 重置图表大小
   */
  resizeAllCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.resize === 'function') {
        chart.resize();
      }
    });
  }

  /**
   * 获取图表实例
   * @param {string} name - 图表名称
   * @returns {Chart|null} 图表实例
   */
  getChart(name) {
    return this.charts[name] || null;
  }
}

// 扩展主应用的图表功能
if (typeof window !== 'undefined') {
  // 等待DOM完全加载
  document.addEventListener('DOMContentLoaded', () => {
    // 只在主应用未创建时才创建图表管理器
    if (!window.chartManager && typeof ChartManager !== 'undefined') {
      console.log('📈 创建图表管理器实例');
      window.chartManager = new ChartManager();
    }
    
    // 监听页面显示事件（仅用于日志输出）
    window.addEventListener('pageShow', (event) => {
      const { pageId } = event.detail;
      console.log(`📊 页面显示事件: ${pageId}`);
      
      // 注意：图表初始化由main.js中的onPageShow方法统一处理
      // 这里不再重复初始化图表，避免多次初始化问题
    });
    
    // 监听窗口大小改变
    window.addEventListener('resize', () => {
      if (window.chartManager) {
        window.chartManager.resizeAllCharts();
      }
    });
  });
}

// 导出图表管理器类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartManager;
}