const GITHUB_API = 'https://api.github.com/repos/Ele-Cat/tauri-app'
const TAGS_API = `${GITHUB_API}/git/refs/tags`

async function fetchLatestTag() {
  const response = await fetch(TAGS_API)
  if (!response.ok) throw new Error('Failed to fetch tags')
  const refs = await response.json()
  if (!refs || refs.length === 0) return null

  const sortedTags = refs
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
}

export async function checkForUpdates(currentVersion) {
  try {
    let latestVersion = null
    let releaseUrl = null

    try {
      const response = await fetch(`${GITHUB_API}/releases/latest`)
      if (response.ok) {
        const data = await response.json()
        latestVersion = data.tag_name?.replace(/^v/, '') || data.name
        releaseUrl = data.html_url
      } else if (response.status === 404) {
        const latestTag = await fetchLatestTag()
        if (latestTag) {
          latestVersion = latestTag
          releaseUrl = `${GITHUB_API}/releases/tag/v${latestTag}`
        }
      }
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
        releaseUrl
      }
    }

    return {
      available: false,
      currentVersion,
      latestVersion
    }
  } catch (error) {
    console.error('Update check failed:', error)
    return {
      available: false,
      error: error.message
    }
  }
}

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
