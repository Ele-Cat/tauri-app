<template>
  <header class="titlebar" data-tauri-drag-region>
    <div class="titlebar-left" :class="{ collapsed: appStore.sidebarCollapsed }">
      <img src="@/assets/images/logo.png" alt="icon" class="iconbar" />
      <span class="title" v-if="!appStore.sidebarCollapsed">{{ $t('app.title') }}</span>
    </div>
    <div class="titlebar-right">
      <el-icon :class="{ disabled: !canBack }" @click="canBack ? router.back() : null" title="返回"><ArrowLeft /></el-icon>
      <el-icon :class="{ disabled: !canForward }" @click="canForward ? router.forward() : null" title="前进"><ArrowRight /></el-icon>
      <el-divider direction="vertical" />
      {{ $t(route.meta.title) }}
    </div>
    <TitleBarButtons />
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/modules/app'
import TitleBarButtons from './TitleBarButtons.vue'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()

const canBack = ref(false)
const canForward = ref(false)

// 检查历史记录状态
const checkHistoryState = () => {
  // 使用window.history来检查历史记录状态
  canBack.value = window.history.state?.back
  canForward.value = window.history.state?.forward
}

// 监听路由变化
watch(() => route.path, () => {
  checkHistoryState()
})

// 初始化时检查
onMounted(() => {
  checkHistoryState()
})
</script>

<style lang="scss" scoped>
.titlebar {
  position: relative;
  height: var(--header-height);
  background: var(--bg-color-tertiary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 0;
  user-select: none;
  -webkit-app-region: drag;
  z-index: 999999;

  .titlebar-left {
    display: flex;
    align-items: center;
    width: 140px;
    padding-left: 10px;

    &.collapsed {
      justify-content: center;
      width: 48px;
      padding-left: 0;
    }

    .iconbar {
      width: 20px;
      height: 20px;
    }

    .title {
      color: var(--text-color);
      font-size: 14px;
      font-weight: 500;
      margin: 0 6px;
    }
  }

  .titlebar-right {
    padding: 0 6px;
    flex: 1;
    gap: 12px;
    display: flex;
    align-items: center;

    .el-icon {
      cursor: pointer;
      -webkit-app-region: no-drag;

      &:hover {
        color: var(--primary-color);
      }

      &.disabled {
        color: var(--text-color-disabled);
        cursor: not-allowed;
        opacity: 0.5;

        &:hover {
          color: var(--text-color-disabled);
        }
      }
    }
  }
}
</style>
