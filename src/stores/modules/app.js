import { defineStore } from "pinia";
import i18n from '@/i18n';

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      isDark: null,
      currentTheme: {
        primaryColor: '#00C1CD',
        primaryColorEnd: '#00a8a3',
      },
      sidebarCollapsed: false,
      language: 'zh-CN',
    };
  },
  getters: {
    isDarkMode: (state) => state.isDark ?? false,
  },
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyDarkMode(this.isDark);
    },

    applyTheme(theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', theme.primaryColor);
      root.style.setProperty('--primary-color-end', theme.primaryColorEnd);
      
      this.applyElementPlusTheme(theme.primaryColor);
    },

    applyElementPlusTheme(primaryColor) {
      const root = document.documentElement;
      root.style.setProperty('--el-color-primary', primaryColor);
      root.style.setProperty('--el-color-primary-light-3', this.lightenColor(primaryColor, 10));
      root.style.setProperty('--el-color-primary-light-5', this.lightenColor(primaryColor, 40));
      root.style.setProperty('--el-color-primary-light-7', this.lightenColor(primaryColor, 60));
      root.style.setProperty('--el-color-primary-light-8', this.lightenColor(primaryColor, 70));
      root.style.setProperty('--el-color-primary-light-9', this.lightenColor(primaryColor, 80));
      root.style.setProperty('--el-color-primary-dark-2', this.darkenColor(primaryColor, 10));
    },

    lightenColor(hex, percent) {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, (num >> 16) + amt);
      const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
      const B = Math.min(255, (num & 0x0000FF) + amt);
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    },

    darkenColor(hex, percent) {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, (num >> 16) - amt);
      const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
      const B = Math.max(0, (num & 0x0000FF) - amt);
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    },

    setDark(value) {
      this.isDark = value;
      this.applyDarkMode(value);
    },

    applyDarkMode(isDark) {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },

    initTheme() {
      this.applyTheme(this.currentTheme);
      this.applyDarkMode(this.isDark);
    },

    setLanguage(lang) {
      this.language = lang;
      i18n.global.locale.value = lang;
    },
  },
  persist: {
    key: 'app',
    storage: localStorage,
    paths: ['sidebarCollapsed', 'language', 'isDark'],
  },
});
