<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <nav class="nav-menu">
      <div
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="goTo(item.path)"
        :title="appStore.sidebarCollapsed ? $t(item.label) : ''"
      >
        <component :is="item.icon" class="nav-icon" :size="22" :stroke-width="2" :title="$t(item.label)" />
        <span class="nav-text" v-if="!appStore.sidebarCollapsed">{{ $t(item.label) }}</span>
      </div>
    </nav>
    <button class="toggle-btn" @click="appStore.toggleSidebar">
      <ChevronRight v-if="appStore.sidebarCollapsed" class="icon" :size="18" :stroke-width="2" />
      <ChevronLeft v-else class="icon" :size="18" :stroke-width="2" />
    </button>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { FileVideo, Settings, Info, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const appStore = useAppStore()

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.path)

const navItems = [
  { path: '/home', label: 'nav.home', icon: FileVideo },
  { path: '/settings', label: 'nav.settings', icon: Settings },
  { path: '/about', label: 'nav.about', icon: Info },
]

function isActive(path) {
  return currentRoute.value === path || currentRoute.value.startsWith(path + '/')
}

function goTo(path) {
  router.push(path)
}
</script>
<style lang="scss" scoped>
.sidebar {
  width: 140px;
  background: var(--bg-color-tertiary);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, background-color 0.3s;
  position: relative;

  &.collapsed {
    width: 48px;
  }
}

.nav-menu {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 8px 16px;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.3s ease;
  gap: 12px;

  .nav-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-text {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
  }

  &:hover {
    background: var(--hover-bg);
  }

  &.active {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-end) 100%);
    color: #fff;
  }
}

.sidebar.collapsed .nav-item {
  padding: 8px 16px;
  justify-content: center;
}

.toggle-btn {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 48px;
  border: none;
  background: var(--bg-color-tertiary);
  color: var(--text-color);
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.version {
  font-size: 12px;
  text-align: center;
  padding: 8px 0;
}
</style>

