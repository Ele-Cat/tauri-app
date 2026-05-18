<template>
  <FHeader />

  <div class="main-layout">
    <FSidebar />

    <div class="main-content">
      <el-scrollbar class="mian-view">
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <keep-alive :include="cachedViews">
                <component style="overflow-x: hidden;" :is="Component" :key="route.path" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FHeader from '@/layouts/FHeader/Index.vue'
import FSidebar from '@/layouts/FSidebar/Index.vue'

const route = useRoute()
const router = useRouter()

const cachedViews = computed(() => {
  const cached = []
  router.getRoutes().forEach(r => {
    if (r.meta.keepAlive) {
      cached.push(r.name)
    }
  })
  return cached
})
</script>

<style lang="scss">
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  height: calc(100vh - var(--header-height));
  overflow: hidden;
  background: var(--bg-color);
  transition: background-color 0.3s;

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

.mian-view {
  height: 100% !important;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
