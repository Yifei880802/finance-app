/**
 * 本地存储工具
 * 封装LocalStorage和IndexedDB操作
 * Author: 开发团队
 * Version: 1.0.0
 */

class StorageManager {
  constructor() {
    this.dbName = 'FinanceAppDB';
    this.dbVersion = 1;
    this.db = null;
    
    this.init();
  }

  /**
   * 初始化存储管理器
   */
  async init() {
    try {
      await this.initIndexedDB();
    } catch (error) {
      console.warn('IndexedDB初始化失败，将使用LocalStorage作为备选方案:', error);
    }
  }

  /**
   * 初始化IndexedDB
   */
  initIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB不被支持'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB初始化成功');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 创建记录表
        if (!db.objectStoreNames.contains('records')) {
          const recordStore = db.createObjectStore('records', { keyPath: 'id' });
          recordStore.createIndex('date', 'date', { unique: false });
          recordStore.createIndex('type', 'type', { unique: false });
          recordStore.createIndex('category', 'category', { unique: false });
        }

        // 创建分类表
        if (!db.objectStoreNames.contains('categories')) {
          const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
          categoryStore.createIndex('type', 'type', { unique: false });
        }

        // 创建设置表
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * 保存数据到LocalStorage
   * @param {string} key - 键名
   * @param {*} data - 数据
   */
  saveToLocalStorage(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error('保存到LocalStorage失败:', error);
      return false;
    }
  }

  /**
   * 从LocalStorage读取数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 读取的数据
   */
  loadFromLocalStorage(key, defaultValue = null) {
    try {
      const jsonData = localStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : defaultValue;
    } catch (error) {
      console.error('从LocalStorage读取失败:', error);
      return defaultValue;
    }
  }

  /**
   * 保存数据到IndexedDB
   * @param {string} storeName - 存储表名
   * @param {*} data - 数据
   */
  async saveToIndexedDB(storeName, data) {
    if (!this.db) {
      throw new Error('IndexedDB未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 从IndexedDB读取数据
   * @param {string} storeName - 存储表名
   * @param {string} key - 键名
   */
  async loadFromIndexedDB(storeName, key) {
    if (!this.db) {
      throw new Error('IndexedDB未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 从IndexedDB读取所有数据
   * @param {string} storeName - 存储表名
   */
  async loadAllFromIndexedDB(storeName) {
    if (!this.db) {
      throw new Error('IndexedDB未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 删除IndexedDB中的数据
   * @param {string} storeName - 存储表名
   * @param {string} key - 键名
   */
  async deleteFromIndexedDB(storeName, key) {
    if (!this.db) {
      throw new Error('IndexedDB未初始化');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 保存应用数据
   * @param {Object} appData - 应用数据
   */
  async saveAppData(appData) {
    // 优先使用IndexedDB
    if (this.db) {
      try {
        // 保存记录
        for (const record of appData.records) {
          await this.saveToIndexedDB('records', record);
        }
        
        // 保存分类
        for (const category of appData.categories) {
          await this.saveToIndexedDB('categories', category);
        }
        
        // 保存设置
        if (appData.settings) {
          await this.saveToIndexedDB('settings', {
            key: 'app_settings',
            data: appData.settings
          });
        }
        
        console.log('数据已保存到IndexedDB');
        return true;
      } catch (error) {
        console.error('IndexedDB保存失败，回退到LocalStorage:', error);
      }
    }
    
    // 回退到LocalStorage
    return this.saveToLocalStorage('financeAppData', appData);
  }

  /**
   * 加载应用数据
   */
  async loadAppData() {
    // 优先使用IndexedDB
    if (this.db) {
      try {
        const [records, categories, settingsData] = await Promise.all([
          this.loadAllFromIndexedDB('records'),
          this.loadAllFromIndexedDB('categories'),
          this.loadFromIndexedDB('settings', 'app_settings')
        ]);
        
        return {
          records: records || [],
          categories: categories || [],
          settings: settingsData ? settingsData.data : {}
        };
      } catch (error) {
        console.error('IndexedDB读取失败，回退到LocalStorage:', error);
      }
    }
    
    // 回退到LocalStorage
    return this.loadFromLocalStorage('financeAppData', {
      records: [],
      categories: [],
      settings: {}
    });
  }

  /**
   * 导出数据
   * @returns {Object} 导出的数据
   */
  async exportData() {
    const data = await this.loadAppData();
    
    return {
      ...data,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * 导入数据
   * @param {Object} importData - 导入的数据
   */
  async importData(importData) {
    try {
      // 验证数据格式
      if (!importData.records || !Array.isArray(importData.records)) {
        throw new Error('无效的数据格式');
      }
      
      // 备份当前数据
      const currentData = await this.loadAppData();
      await this.saveToLocalStorage('financeAppData_backup', {
        ...currentData,
        backupDate: new Date().toISOString()
      });
      
      // 导入新数据
      await this.saveAppData({
        records: importData.records,
        categories: importData.categories || [],
        settings: importData.settings || {}
      });
      
      console.log('数据导入成功');
      return true;
    } catch (error) {
      console.error('数据导入失败:', error);
      throw error;
    }
  }

  /**
   * 清空所有数据
   */
  async clearAllData() {
    try {
      // 清空IndexedDB
      if (this.db) {
        const storeNames = ['records', 'categories', 'settings'];
        for (const storeName of storeNames) {
          const transaction = this.db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          await new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      }
      
      // 清空LocalStorage
      localStorage.removeItem('financeAppData');
      
      console.log('所有数据已清空');
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取存储使用情况
   * @returns {Object} 存储信息
   */
  async getStorageInfo() {
    const info = {
      localStorage: {
        used: 0,
        total: 5 * 1024 * 1024, // 5MB估算
        available: true
      },
      indexedDB: {
        used: 0,
        available: !!this.db
      }
    };
    
    // 计算LocalStorage使用量
    try {
      let localStorageSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage[key].length + key.length;
        }
      }
      info.localStorage.used = localStorageSize;
    } catch (error) {
      info.localStorage.available = false;
    }
    
    // 计算IndexedDB使用量（如果支持）
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        info.indexedDB.used = estimate.usage || 0;
        info.indexedDB.total = estimate.quota || 0;
      } catch (error) {
        console.warn('无法获取存储配额信息:', error);
      }
    }
    
    return info;
  }
}

// 全局存储管理器实例
let storageManager;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
  storageManager = new StorageManager();
  
  // 将实例挂载到全局
  window.storageManager = storageManager;
});

// 导出存储管理器类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}