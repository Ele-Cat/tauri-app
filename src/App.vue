<template>
  <div id="app" class="app-container">
    <el-config-provider :locale="locale" :card="cardConfig" :message="messageConfig">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useAppStore } from '@/stores/modules/app'
import { useDark } from '@/hooks/useDark'

const appStore = useAppStore()
const { init: initDark } = useDark()

const locale = computed(() => appStore.language === 'en-US' ? en : zhCn)

const messageConfig = reactive({
  max: 3,
  offset: 60,
})

const cardConfig = reactive({
  shadow: 'never',
})

onMounted(() => {
  initDark()
})
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>