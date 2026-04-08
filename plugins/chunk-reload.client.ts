/**
 * Handles "Failed to fetch dynamically imported module" errors.
 *
 * When a new deploy replaces JS chunks, users with a cached HTML page will try
 * to fetch the old (now 404) chunks. We catch the Vite preload error event and
 * do a hard reload so the browser picks up the fresh HTML + new chunks.
 */
export default defineNuxtPlugin(() => {
  window.addEventListener('vite:preloadError', () => {
    window.location.reload()
  })
})
