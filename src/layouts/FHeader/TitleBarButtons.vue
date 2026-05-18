<template>
  <div class="titlebar-buttons">
    <!-- <MessageCircleQuestionMark class="icon" :size="16" :stroke-width="2" /> -->
    <!-- <a class="help" @click="toHelp">
      <GraduationCap class="icon" :size="16" :stroke-width="2" />
      教程
    </a> -->
    <!-- <el-divider direction="vertical" /> -->
    <button class="window-btn pin-btn" @click="togglePin" :title="isPinned ? $t('titlebar.unpin') : $t('titlebar.pin')">
      <Pin class="icon" :class="{ pinned: isPinned }" :size="16" :stroke-width="2" />
    </button>
    <button class="window-btn theme-btn" @click="handleToggleTheme" :title="isDark ? $t('titlebar.switchLight') : $t('titlebar.switchDark')">
      <Sun v-if="!isDark" class="icon" :size="16" :stroke-width="2" />
      <Moon v-else class="icon" :size="16" :stroke-width="2" />
    </button>
    <el-divider direction="vertical" />
    <button class="window-btn minimize" @click="minimizeWindow" :title="$t('titlebar.minimize')">
      <Minus class="icon" :size="16" :stroke-width="2" />
    </button>
    <button class="window-btn maximize" @click="toggleMaximize" :title="isMaximized ? $t('titlebar.restore') : $t('titlebar.maximize')">
      <Minimize2 v-if="isMaximized" class="icon" :size="16" :stroke-width="2" />
      <Square v-else class="icon" :size="14" :stroke-width="2" />
    </button>
    <button class="window-btn close" @click="closeWindow" :title="$t('titlebar.close')">
      <X class="icon" :size="16" :stroke-width="2" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useDark } from '@/hooks/useDark'
import { MessageCircleQuestionMark, GraduationCap, Pin, Sun, Moon, Minus, Minimize2, Square, X } from 'lucide-vue-next'

const win = getCurrentWindow()

const { isDark, toggle: toggleDark } = useDark()
const isMaximized = ref(false)
const isPinned = ref(false)

async function togglePin() {
  try {
    await win.setAlwaysOnTop(!isPinned.value)
    isPinned.value = !isPinned.value
  } catch (e) {
    console.error('置顶失败:', e)
  }
}

win.isAlwaysOnTop().then(top => {
  isPinned.value = top
})

function handleToggleTheme(e) {
  toggleDark(e)
}

async function minimizeWindow() {
  try {
    await win.minimize()
  } catch (e) {
    console.error('最小化失败:', e)
  }
}

async function toggleMaximize() {
  try {
    const maximized = await win.isMaximized()
    if (maximized) {
      await win.unmaximize()
    } else {
      await win.maximize()
    }
    isMaximized.value = !maximized
  } catch (e) {
    console.error('最大化切换失败:', e)
  }
}

async function closeWindow() {
  try {
    await invoke('hide_to_tray')
  } catch (e) {
    console.error('关闭失败:', e)
  }
}

win.isMaximized().then(max => {
  isMaximized.value = max
})

let unlistenMaximize = null

onMounted(async () => {
  unlistenMaximize = await win.onResized(() => {
    win.isMaximized().then(max => {
      isMaximized.value = max
    })
  })
})

onUnmounted(() => {
  if (unlistenMaximize) {
    unlistenMaximize()
  }
})
</script>

<style lang="scss" scoped>
.titlebar-buttons {
  display: flex;
  align-items: center;
  gap: 3px;
  -webkit-app-region: no-drag;
}

.help {
  cursor: pointer;
}

.window-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  font-size: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--hover-bg);
  }

  .icon {
    &.pinned {
      color: var(--primary-color);
      transform: rotate(45deg);
    }
  }

  &.close:hover {
    background: var(--danger-color);
    color: #fff;
  }
}
</style>
