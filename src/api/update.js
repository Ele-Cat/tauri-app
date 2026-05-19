import { writeFile } from '@tauri-apps/plugin-fs'
import { save } from '@tauri-apps/plugin-dialog'
import { openUrl } from '@tauri-apps/plugin-opener'
import { invoke } from '@tauri-apps/api/core'
import { fetch } from '@tauri-apps/plugin-http'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { GITHUB_CONFIG } from '@/config'

const GITHUB_API = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`
const GITHUB_RELEASES_API = `${GITHUB_API}/releases/latest`
const GITHUB_TAGS_API = `${GITHUB_API}/git/refs/tags`

function isNewVersionAvailable(current, latest) {
  const currentParts = current.split('.').map(Number)
  const latestParts = latest.split('.').map(Number)

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const a = currentParts[i] || 0
    const b = latestParts[i] || 0
    if (b > a) return true
    if (a > b) return false
  }
  return false
}

export async function checkForUpdates(currentVersion) {
  try {
    let latestVersion = null
    let releaseUrl = null
    let releaseNotes = null

    try {
      const data = await request.get(GITHUB_RELEASES_API)
      latestVersion = data.tag_name?.replace(/^v/, '') || data.name
      releaseUrl = data.html_url
      releaseNotes = data.body || ''
    } catch {
      const latestTag = await fetchLatestTag()
      if (latestTag) {
        latestVersion = latestTag
        releaseUrl = `${GITHUB_API}/releases/tag/v${latestTag}`
      }
    }

    if (!latestVersion) {
      return {
        available: false,
        error: 'No releases or tags found'
      }
    }

    if (isNewVersionAvailable(currentVersion, latestVersion)) {
      return {
        available: true,
        currentVersion,
        latestVersion,
        releaseUrl,
        releaseNotes
      }
    }

    return {
      available: false,
      currentVersion,
      latestVersion
    }
  } catch (error) {
    return {
      available: false,
      error: error.message
    }
  }
}

async function fetchLatestTag() {
  try {
    const data = await request.get(GITHUB_TAGS_API)
    if (!data || data.length === 0) return null

    const sortedTags = data
      .map(ref => ref.ref.replace('refs/tags/', ''))
      .filter(tag => tag.startsWith('v'))
      .sort((a, b) => {
        const aParts = a.replace(/^v/, '').split('.').map(Number)
        const bParts = b.replace(/^v/, '').split('.').map(Number)
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const diff = (bParts[i] || 0) - (aParts[i] || 0)
          if (diff !== 0) return diff
        }
        return 0
      })

    return sortedTags[0]?.replace(/^v/, '') || null
  } catch {
    return null
  }
}

function getPlatformInfo() {
  const ua = navigator.userAgent
  const platform = navigator.platform

  if (ua.includes('Windows') || platform.includes('Win')) {
    return { os: 'windows', arch: 'x64' }
  } else if (ua.includes('Mac OS') || ua.includes('Macintosh') || platform.includes('Mac')) {
    if (ua.includes('ARM64') || ua.includes('Apple Silicon')) {
      return { os: 'macos', arch: 'arm64' }
    }
    return { os: 'macos', arch: 'x64' }
  } else if (ua.includes('Linux') || platform.includes('Linux')) {
    return { os: 'linux', arch: 'x64' }
  }
  return { os: 'windows', arch: 'x64' }
}

function getDownloadFileName(version, platform) {
  const { os, arch } = platform

  if (os === 'windows') {
    return `${GITHUB_CONFIG.repo}_${version}_x64-setup.exe`
  } else if (os === 'macos') {
    return `${GITHUB_CONFIG.repo}_${version}_${arch}.dmg`
  } else if (os === 'linux') {
    return `${GITHUB_CONFIG.repo}_${version}_amd64.deb`
  }
  return null
}

function getDownloadUrl(version, platform) {
  const fileName = getDownloadFileName(version, platform)
  if (!fileName) return null
  return `https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/releases/download/v${version}/${fileName}`
}

export async function downloadAndInstall(version, releaseUrl, onProgressChange) {
  const platform = getPlatformInfo()
  const downloadUrl = getDownloadUrl(version, platform)

  if (!downloadUrl) {
    openUrl(releaseUrl)
    return
  }

  const fileName = getDownloadFileName(version, platform)

  const savePath = await save({
    defaultPath: fileName,
    filters: [{
      name: 'Executable',
      extensions: ['exe', 'dmg', 'deb']
    }]
  })

  if (!savePath) return

  onProgressChange({ percent: 0, loaded: 0, total: 0 })
  ElMessage.info('开始下载...')

  try {
    const response = await fetch(downloadUrl)

    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`)
    }

    // const blob = await response.blob()
    const contentLength = response.headers.get('content-length')
    const total = contentLength ? parseInt(contentLength, 10) : 0
    let loaded = 0

    const reader = response.body.getReader()
    const chunks = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      chunks.push(value)
      loaded += value.length
      if (total > 0) {
        const percent = Math.round((loaded / total) * 100)
        onProgressChange({ percent, loaded, total })
      }
    }

    const blob = new Blob(chunks)
    const arrayBuffer = await blob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    await writeFile(savePath, uint8Array)

    onProgressChange({ percent: 100, loaded, total })
    ElMessage.success('下载完成，正在打开安装程序...')

    await invoke('open_file', { path: savePath })

  } catch (error) {
    console.error('Download error:', error)
    ElMessage({
      message: '应用内下载失败，将跳转到浏览器下载',
      type: 'warning',
      duration: 0,
      showClose: true,
      grouping: true,
    })
    openUrl(releaseUrl)
  }
}
