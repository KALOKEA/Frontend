'use client'
import { useEffect, useRef } from 'react'

/**
 * Scroll-triggered reveal hook.
 * Adds `.revealed` class to the element when it enters the viewport.
 * Pair with `.reveal-ready` CSS class in globals.css for fade-in-up effect.
 *
 * Usage:
 *   const ref = useReveal()
 *   <section ref={ref} className="reveal-ready">...</section>
 */
export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already visible on load (above the fold)
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      el.classList.add('revealed')
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return ref
}

/**
 * Staggered grid reveal — applies .reveal-ready + .revealed with delays
 * to each child as they scroll into view.
 */
export function useRevealStagger<T extends HTMLElement = HTMLElement>(threshold = 0.08) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = Array.from(container.children) as HTMLElement[]
    children.forEach((child, i) => {
      child.style.opacity = '0'
      child.style.transform = 'translateY(24px)'
      child.style.transition = `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`
    })

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => {
            child.style.opacity = '1'
            child.style.transform = 'translateY(0)'
          })
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(container)
    return () => obs.disconnect()
  }, [threshold])

  return ref
}
