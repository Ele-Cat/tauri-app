<template>
  <div class="settings-general">
    <el-card shadow="never">
      <el-form label-width="120px">
        <el-form-item :label="$t('settings.language')">
          <el-radio-group type="button" v-model="appStore.language" @change="appStore.setLanguage">
            <el-radio-button label="简体中文" value="zh-CN" />
            <el-radio-button label="English" value="en-US" />
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('settings.update.title')">
          <el-button
            :loading="checking"
            :disabled="checking"
            :icon="RefreshCw"
            @click="checkUpdates"
            type="primary"
          >
            {{ $t('settings.update.check') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      v-model="showUpdateDialog"
      :title="$t('settings.update.dialogTitle')"
      width="480px"
      :close-on-click-modal="false"
      :show-close="!downloading"
    >
      <div class="update-dialog-content">
        <div v-if="!downloading" class="update-version-info">
          <div class="version-compare">
            <span class="version-label">{{ $t('settings.update.current') }}:</span>
            <span class="version-num">v{{ currentVersion }}</span>
          </div>
          <div class="version-arrow">→</div>
          <div class="version-compare">
            <span class="version-label">{{ $t('settings.update.latest') }}:</span>
            <span class="version-num highlight">v{{ latestVersion }}</span>
          </div>
        </div>
        <div v-if="downloading" class="download-progress">
          <div class="progress-info">
            <span>{{ $t('settings.update.downloading') }}</span>
            <span v-if="downloadLoaded">{{ formatBytes(downloadLoaded) }} / {{ formatBytes(downloadTotal) }}</span>
          </div>
          <el-progress
            :percentage="downloadProgress"
            :stroke-width="16"
            text-inside
          />
        </div>
        <div v-if="!downloading && releaseNotes" class="update-release-notes">
          <span class="release-notes-title">{{ $t('settings.update.releaseNotes') }}:</span>
          <pre class="release-notes">{{ releaseNotes }}</pre>
        </div>
      </div>
      <template #footer>
        <div v-if="!downloading">
          <el-button @click="showUpdateDialog = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" :icon="Download" @click="startDownload">
            {{ $t('settings.update.download') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshCw, Download } from 'lucide-vue-next'
import { useAppStore } from '@/stores/modules/app'
import { checkForUpdates, downloadAndInstall } from '@/api/update'
import { version } from '@/../package.json'

const appStore = useAppStore()
const currentVersion = version
const latestVersion = ref('')
const checking = ref(false)
const showUpdateDialog = ref(false)
const releaseUrl = ref('')
const releaseNotes = ref('')
const downloading = ref(false)
const downloadProgress = ref(0)
const downloadLoaded = ref(0)
const downloadTotal = ref(0)

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

async function checkUpdates() {
  checking.value = true

  try {
    const result = await checkForUpdates(currentVersion)

    if (result.error) {
      ElMessage.error(result.error)
    } else if (result.available) {
      latestVersion.value = result.latestVersion
      releaseUrl.value = result.releaseUrl
      releaseNotes.value = result.releaseNotes || ''
      showUpdateDialog.value = true
    } else {
      ElMessage.success($t('settings.update.noUpdate'))
    }
  } catch (error) {
    ElMessage.error('检查更新失败: ' + error.message)
  } finally {
    checking.value = false
  }
}

async function startDownload() {
  if (!releaseUrl.value) return

  downloading.value = true
  downloadProgress.value = 0

  try {
    await downloadAndInstall(latestVersion.value, releaseUrl.value, (progress) => {
      downloadProgress.value = progress.percent
      downloadLoaded.value = progress.loaded
      downloadTotal.value = progress.total

      if (progress.percent === 100) {
        downloading.value = false
      }
    })
  } finally {
    downloading.value = false
    downloadProgress.value = 0
    downloadLoaded.value = 0
    downloadTotal.value = 0
  }
}
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

.update-dialog-content {
  .update-version-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 8px 0;

    .version-compare {
      display: flex;
      align-items: center;
      gap: 8px;

      .version-label {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }

      .version-num {
        font-size: 16px;
        font-weight: 600;

        &.highlight {
          color: var(--el-color-success);
        }
      }
    }

    .version-arrow {
      font-size: 20px;
      color: var(--el-text-color-muted);
    }
  }

  .download-progress {
    padding: 20px 0;

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
  }

  .update-release-notes {
    font-size: 14px;
    line-height: 24px;

    .release-notes-title {
      font-weight: 600;
    }

    .release-notes {
      background: var(--bg-color-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 12px;
      margin-top: 8px;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 200px;
      overflow-y: auto;
    }
  }
}
</style>
