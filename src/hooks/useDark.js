import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const isDark = ref(false)
const initialized = ref(false)

export function useDark() {
  function getAppStore() {
    return useAppStore()
  }

  function init() {
    if (initialized.value) return
    initialized.value = true

    const savedTheme = getAppStore().isDark
    if (savedTheme !== null && savedTheme !== undefined) {
      isDark.value = savedTheme
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
    document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
  }

  function toggle(event) {
    if (event) {
      const { clientX: x, clientY: y } = event
      document.documentElement.style.setProperty('--click-x', `${x}px`)
      document.documentElement.style.setProperty('--click-y', `${y}px`)

      if (document.startViewTransition) {
        const transition = document.startViewTransition(() => {
          doToggle()
        })
        transition.finished.finally(() => {
          document.documentElement.style.removeProperty('--click-x')
          document.documentElement.style.removeProperty('--click-y')
        })
        return
      }
    }
    doToggle()
  }

  function doToggle() {
    isDark.value = !isDark.value
    getAppStore().setDark(isDark.value)
    applyTheme()
  }

  function setDark(value) {
    isDark.value = value
    getAppStore().setDark(value)
    applyTheme()
  }

  watch(isDark, () => {
    applyTheme()
  })

  return {
    isDark,
    init,
    toggle,
    setDark
  }
}
