<template>
  <div class="tabs-container">
    <el-tabs v-model="activeMenu">
      <el-tab-pane v-for="item in menus" :key="item.name" :name="item.name">
        <template #label>
          <span class="custom-tabs-label">
            <component :is="item.icon" :size="16" :stroke-width="2" />
            <span>{{ $t(item.label) }}</span>
          </span>
        </template>
        <component
          :is="item.component"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
defineOptions({ name: 'Settings' })
import { ref } from 'vue'
import { Settings } from 'lucide-vue-next'
import General from './modules/General.vue'

const activeMenu = ref('general')

const menus = [
  { label: 'settings.general', name: 'general', component: General, icon: Settings },
]
</script>
