import { useConfigStore } from './configStore'

function encodeObj(obj: any) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
}
function decodeObj(s: string) {
  return JSON.parse(decodeURIComponent(escape(atob(s))))
}

export function initUrlSync() {
  const hash = location.hash.replace(/^#/, '')
  if (hash.startsWith('cfg=')) {
    try {
      useConfigStore.getState().replaceConfig(decodeObj(hash.slice(4)))
    } catch {
      /* ignore */
    }
  }

  let prev = ''
  useConfigStore.subscribe(state => {
    try {
      const h = 'cfg=' + encodeObj(state.config)
      if (h !== prev) {
        prev = h
        history.replaceState(null, '', '#' + h)
      }
    } catch {
      /* ignore */
    }
  })
}

