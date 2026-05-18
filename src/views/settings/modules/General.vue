<template>
  <div class="settings-general">
    <el-card shadow="never">
      <el-form label-width="100px">
        <el-form-item :label="$t('settings.language')">
          <el-radio-group type="button" v-model="appStore.language" @change="appStore.setLanguage">
            <el-radio-button label="简体中文" value="zh-CN" />
            <el-radio-button label="English" value="en-US" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.settings-general {
  max-width: 800px;

  .form-tip {
    margin-left: 12px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
