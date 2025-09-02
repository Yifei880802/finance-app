/**
 * 辅助工具函数
 * 提供常用的工具函数和格式化方法
 * Author: 开发团队
 * Version: 1.0.0
 */

/**
 * 格式化货币金额
 * @param {number} amount - 金额
 * @param {string} currency - 货币符号
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的金额
 */
function formatCurrency(amount, currency = '¥', decimals = 2) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency}0.${'0'.repeat(decimals)}`;
  }
  
  const formatted = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return `${currency}${formatted}`;
}

/**
 * 格式化日期时间
 * @param {Date|string} date - 日期
 * @param {string} format - 格式类型 (full, date, time, relative)
 * @returns {string} 格式化后的日期
 */
function formatDateTime(date, format = 'full') {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '无效日期';
  }
  
  const now = new Date();
  const diffTime = now - dateObj;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  switch (format) {
    case 'relative':
      if (diffTime < 60000) {
        return '刚刚';
      } else if (diffTime < 3600000) {
        const minutes = Math.floor(diffTime / 60000);
        return `${minutes}分钟前`;
      } else if (diffDays === 0) {
        return `今天 ${dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays === 1) {
        return `昨天 ${dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}周前`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months}个月前`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years}年前`;
      }
      
    case 'date':
      return dateObj.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
    case 'time':
      return dateObj.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
    case 'full':
    default:
      return dateObj.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * 生成唯一ID
 * @param {string} prefix - ID前缀
 * @returns {string} 唯一ID
 */
function generateUniqueId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 深度克隆对象
 * @param {*} obj - 要克隆的对象
 * @returns {*} 克隆后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
function validatePhone(phone) {
  const re = /^1[3-9]\d{9}$/;
  return re.test(phone);
}

/**
 * 验证金额格式
 * @param {string|number} amount - 金额
 * @returns {boolean} 是否有效
 */
function validateAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= 999999999;
}

/**
 * 获取颜色的透明度版本
 * @param {string} color - 颜色值（hex格式）
 * @param {number} alpha - 透明度 (0-1)
 * @returns {string} RGBA颜色值
 */
function getColorWithAlpha(color, alpha) {
  // 移除#号
  const hex = color.replace('#', '');
  
  // 转换为RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 计算两个日期之间的天数差
 * @param {Date|string} date1 - 第一个日期
 * @param {Date|string} date2 - 第二个日期
 * @returns {number} 天数差
 */
function daysBetween(date1, date2) {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 获取本月第一天
 * @param {Date} date - 参考日期
 * @returns {Date} 本月第一天
 */
function getMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 获取本月最后一天
 * @param {Date} date - 参考日期
 * @returns {Date} 本月最后一天
 */
function getMonthEnd(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * 获取周一日期
 * @param {Date} date - 参考日期
 * @returns {Date} 周一日期
 */
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * 检测设备类型
 * @returns {Object} 设备信息
 */
function detectDevice() {
  const userAgent = navigator.userAgent;
  
  return {
    isMobile: /Mobi|Android/i.test(userAgent),
    isTablet: /Tablet|iPad/i.test(userAgent),
    isDesktop: !/Mobi|Android|Tablet|iPad/i.test(userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(userAgent),
    isAndroid: /Android/i.test(userAgent),
    isSafari: /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent),
    isChrome: /Chrome/i.test(userAgent),
    isFirefox: /Firefox/i.test(userAgent),
    isEdge: /Edge/i.test(userAgent)
  };
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @param {string} url - URL（可选，默认当前URL）
 * @returns {string|null} 参数值
 */
function getUrlParameter(name, url = window.location.href) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(name);
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

/**
 * 下载文件
 * @param {Blob|string} data - 文件数据或URL
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME类型
 */
function downloadFile(data, filename, mimeType = 'application/octet-stream') {
  let blob;
  
  if (data instanceof Blob) {
    blob = data;
  } else if (typeof data === 'string') {
    blob = new Blob([data], { type: mimeType });
  } else {
    blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 清理URL对象
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * 获取随机颜色
 * @param {number} alpha - 透明度
 * @returns {string} 随机颜色
 */
function getRandomColor(alpha = 1) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}

/**
 * 本地化数字
 * @param {number} number - 数字
 * @param {string} locale - 地区代码
 * @returns {string} 本地化后的数字
 */
function localizeNumber(number, locale = 'zh-CN') {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * 计算百分比
 * @param {number} part - 部分值
 * @param {number} total - 总值
 * @param {number} decimals - 小数位数
 * @returns {number} 百分比
 */
function calculatePercentage(part, total, decimals = 1) {
  if (total === 0) return 0;
  return parseFloat(((part / total) * 100).toFixed(decimals));
}

/**
 * 延迟执行
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise} Promise对象
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 设备信息缓存
const deviceInfo = detectDevice();

// 导出所有工具函数
const helpers = {
  formatCurrency,
  formatDateTime,
  formatFileSize,
  generateUniqueId,
  debounce,
  throttle,
  deepClone,
  validateEmail,
  validatePhone,
  validateAmount,
  getColorWithAlpha,
  daysBetween,
  getMonthStart,
  getMonthEnd,
  getWeekStart,
  detectDevice,
  getUrlParameter,
  copyToClipboard,
  downloadFile,
  getRandomColor,
  localizeNumber,
  calculatePercentage,
  sleep,
  deviceInfo
};

// 挂载到全局
if (typeof window !== 'undefined') {
  window.helpers = helpers;
}

// 导出（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = helpers;
}