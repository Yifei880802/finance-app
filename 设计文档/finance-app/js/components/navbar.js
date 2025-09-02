/**
 * 导航组件管理
 * 处理底部导航、状态栏和页面切换动画
 * Author: 开发团队
 * Version: 1.0.0
 */

class NavigationManager {
  constructor() {
    this.currentPage = 'home';
    this.isTransitioning = false;
    
    this.init();
  }

  /**
   * 初始化导航管理器
   */
  init() {
    this.setupStatusBar();
    this.setupEventListeners();
    this.updateNavigationState();
  }

  /**
   * 设置状态栏
   */
  setupStatusBar() {
    this.updateStatusBarTime();
    
    // 每分钟更新一次时间
    setInterval(() => {
      this.updateStatusBarTime();
    }, 60000);
    
    // 监听网络状态
    this.updateNetworkStatus();
    window.addEventListener('online', () => this.updateNetworkStatus());
    window.addEventListener('offline', () => this.updateNetworkStatus());
    
    // 监听电池状态（如果支持）
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.updateBatteryStatus(battery);
        
        battery.addEventListener('chargingchange', () => this.updateBatteryStatus(battery));
        battery.addEventListener('levelchange', () => this.updateBatteryStatus(battery));
      });
    }
  }

  /**
   * 更新状态栏时间
   */
  updateStatusBarTime() {
    const timeElement = document.getElementById('statusTime');
    if (timeElement) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
      timeElement.textContent = timeString;
    }
  }

  /**
   * 更新网络状态
   */
  updateNetworkStatus() {
    const wifiIcon = document.querySelector('.status-bar__icons .fa-wifi');
    if (wifiIcon) {
      if (navigator.onLine) {
        wifiIcon.style.opacity = '1';
        wifiIcon.style.color = '#FFFFFF';
      } else {
        wifiIcon.style.opacity = '0.5';
        wifiIcon.style.color = '#FF3B30';
      }
    }
  }

  /**
   * 更新电池状态
   * @param {Battery} battery - 电池对象
   */
  updateBatteryStatus(battery) {
    const batteryLevel = document.querySelector('.battery-level');
    if (batteryLevel) {
      const level = Math.round(battery.level * 100);
      batteryLevel.style.width = `${level}%`;
      
      // 根据电量调整颜色
      if (level > 20) {
        batteryLevel.style.backgroundColor = '#34C759';
      } else if (level > 10) {
        batteryLevel.style.backgroundColor = '#FF9500';
      } else {
        batteryLevel.style.backgroundColor = '#FF3B30';
      }
      
      // 充电状态指示
      const battery_container = batteryLevel.parentElement;
      if (battery.charging) {
        battery_container.classList.add('charging');
      } else {
        battery_container.classList.remove('charging');
      }
    }
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 底部导航点击事件
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item');
      if (navItem && navItem.dataset.page) {
        e.preventDefault();
        this.navigateToPage(navItem.dataset.page);
      }
    });

    // 返回按钮事件
    document.addEventListener('click', (e) => {
      if (e.target.matches('.top-nav__back') || e.target.closest('.top-nav__back')) {
        e.preventDefault();
        this.navigateBack();
      }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // 手势支持
    this.setupGestureNavigation();
    
    // 浏览器历史管理
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.navigateToPage(e.state.page, false);
      }
    });
  }

  /**
   * 处理键盘导航
   * @param {KeyboardEvent} e - 键盘事件
   */
  handleKeyboardNavigation(e) {
    // ESC键返回
    if (e.key === 'Escape') {
      this.navigateBack();
      return;
    }

    // 数字键快速导航
    const pageMap = {
      '1': 'home',
      '2': 'stats',
      '3': 'record',
      '4': 'settings'
    };
    
    if (pageMap[e.key]) {
      this.navigateToPage(pageMap[e.key]);
    }
  }

  /**
   * 设置手势导航
   */
  setupGestureNavigation() {
    let startX = 0;
    let startY = 0;
    let isSwipe = false;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwipe = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isSwipe) return;
      
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      
      // 如果垂直滑动距离大于水平距离，不处理
      if (deltaY > deltaX) {
        isSwipe = false;
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!isSwipe) return;
      
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;
      
      // 最小滑动距离
      const minSwipeDistance = 50;
      
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // 右滑 - 返回
          this.navigateBack();
        } else {
          // 左滑 - 可以添加前进功能
          // this.navigateForward();
        }
      }
      
      isSwipe = false;
    }, { passive: true });
  }

  /**
   * 导航到指定页面
   * @param {string} pageId - 页面ID
   * @param {boolean} pushState - 是否推入浏览器历史
   */
  navigateToPage(pageId, pushState = true) {
    if (this.isTransitioning || pageId === this.currentPage) {
      return;
    }

    this.isTransitioning = true;
    
    // 添加导航动画
    this.addNavigationFeedback(pageId);
    
    // 更新浏览器历史
    if (pushState) {
      history.pushState({ page: pageId }, '', `#${pageId}`);
    }
    
    // 触发页面切换
    if (window.FinanceApp) {
      window.FinanceApp.showPage(pageId);
    }
    
    // 更新导航状态
    this.updateNavigationState(pageId);
    
    // 更新当前页面
    this.currentPage = pageId;
    
    // 重置转换状态
    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
  }

  /**
   * 返回导航
   */
  navigateBack() {
    if (this.currentPage === 'home') {
      // 已经在首页，可以考虑退出应用或显示确认对话框
      this.showExitConfirmation();
      return;
    }
    
    // 返回首页
    this.navigateToPage('home');
  }

  /**
   * 更新导航状态
   * @param {string} activePageId - 当前活跃页面ID
   */
  updateNavigationState(activePageId = this.currentPage) {
    // 更新底部导航项状态
    document.querySelectorAll('.nav-item').forEach(item => {
      const isActive = item.dataset.page === activePageId;
      
      item.classList.toggle('nav-item--active', isActive);
      
      // 更新aria-selected属性
      item.setAttribute('aria-selected', isActive);
    });
    
    // 更新页面标题
    this.updatePageTitle(activePageId);
  }

  /**
   * 更新页面标题
   * @param {string} pageId - 页面ID
   */
  updatePageTitle(pageId) {
    const titles = {
      home: '简记 - 首页',
      record: '简记 - 记账',
      stats: '简记 - 统计',
      settings: '简记 - 设置'
    };
    
    document.title = titles[pageId] || '简记';
  }

  /**
   * 添加导航反馈动画
   * @param {string} pageId - 目标页面ID
   */
  addNavigationFeedback(pageId) {
    const targetNavItem = document.querySelector(`[data-page="${pageId}"]`);
    if (targetNavItem) {
      // 添加点击动画
      targetNavItem.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        targetNavItem.style.transform = 'scale(1)';
      }, 150);
      
      // 添加波纹效果
      this.createRippleEffect(targetNavItem);
    }
  }

  /**
   * 创建波纹效果
   * @param {HTMLElement} element - 目标元素
   */
  createRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-animation 0.6s ease-out';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.marginLeft = '-50px';
    ripple.style.marginTop = '-50px';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * 显示退出确认
   */
  showExitConfirmation() {
    if (confirm('确定要退出应用吗？')) {
      // 在PWA环境中可以关闭应用
      if (window.navigator && window.navigator.app) {
        window.navigator.app.exitApp();
      } else {
        window.close();
      }
    }
  }

  /**
   * 设置徽章数量
   * @param {string} pageId - 页面ID
   * @param {number} count - 徽章数量
   */
  setBadgeCount(pageId, count) {
    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (!navItem) return;
    
    let badge = navItem.querySelector('.nav-item__badge');
    
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'nav-item__badge';
        navItem.appendChild(badge);
      }
      
      badge.textContent = count > 99 ? '99+' : count.toString();
      badge.classList.add('nav-item__badge--visible');
    } else if (badge) {
      badge.classList.remove('nav-item__badge--visible');
      setTimeout(() => {
        badge.remove();
      }, 200);
    }
  }

  /**
   * 获取当前页面
   * @returns {string} 当前页面ID
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * 是否正在转换
   * @returns {boolean} 转换状态
   */
  isNavigating() {
    return this.isTransitioning;
  }
}

// 添加波纹动画CSS
if (!document.querySelector('#ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = `
    @keyframes ripple-animation {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    .battery.charging::after {
      content: '⚡';
      position: absolute;
      right: -12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      color: #34C759;
    }
  `;
  document.head.appendChild(style);
}

// 全局导航管理器实例
let navigationManager;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  navigationManager = new NavigationManager();
  
  // 将实例挂载到全局
  window.navigationManager = navigationManager;
  
  // 初始化页面状态
  const initialPage = location.hash.slice(1) || 'home';
  navigationManager.navigateToPage(initialPage, false);
});

// 导出导航管理器类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationManager;
}