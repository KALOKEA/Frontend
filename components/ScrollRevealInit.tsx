'use client'
import { useEffect } from 'react'

/**
 * Global scroll-reveal observer.
 * Watches all .reveal, .reveal-left, .reveal-right elements and adds .visible
 * when they enter the viewport — matching reference script.js exactly:
 *   threshold: 0.12, rootMargin: '0px 0px -40px 0px'
 */
export default function ScrollRevealInit() {
  useEffect(() => {
    // Skip all animations when user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Make all reveal elements immediately visible
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right')
        .forEach(el => el.classList.add('visible'))
      return
    }

    const selector = '.reveal, .reveal-left, .reveal-right'

    function observe() {
      const elements = document.querySelectorAll<HTMLElement>(selector)
      if (!elements.length) return

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              obs.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )

      elements.forEach((el) => {
        // If already in view on load (above fold), show immediately
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('visible')
        } else {
          obs.observe(el)
        }
      })

      return () => obs.disconnect()
    }

    // Run once on mount, then re-run on route changes via MutationObserver
    let cleanup = observe()

    // Watch for new .reveal elements added by dynamic renders (e.g. route changes).
    // Debounced: accumulate mutations for 200ms then check if any new un-observed
    // .reveal elements exist before resetting the entire observer. This avoids
    // redundant resets on every input keystroke / cart update / tooltip open.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const mutObs = new MutationObserver(() => {
      if (debounceTimer) return
      debounceTimer = setTimeout(() => {
        debounceTimer = null
        // Only reset if there are un-observed .reveal elements
        const fresh = document.querySelectorAll(`${selector}:not(.visible)`)
        if (fresh.length) { cleanup?.(); cleanup = observe() }
      }, 200)
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      cleanup?.()
      mutObs.disconnect()
    }
  }, [])

  return null
}
