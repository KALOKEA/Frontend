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

    // Watch for new .reveal elements added by dynamic renders
    const mutObs = new MutationObserver(() => {
      cleanup?.()
      cleanup = observe()
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      cleanup?.()
      mutObs.disconnect()
    }
  }, [])

  return null
}
