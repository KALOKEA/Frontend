'use client'
import { useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

export default function LiveChatWidget() {
  useEffect(() => {
    fetch(`${API}/settings/public`)
      .then(r => r.json())
      .then(settings => {
        // Backend wraps all responses in { success, data, timestamp } — unwrap.
        const payload = settings?.data ?? settings
        const script = payload?.live_chat_widget?.trim()
        if (!script) return
        const container = document.createElement('div')
        container.id = 'kalokea-chat-widget'
        container.innerHTML = script
        // Execute any <script> tags inside
        container.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script')
          Array.from(oldScript.attributes).forEach(attr =>
            newScript.setAttribute(attr.name, attr.value)
          )
          newScript.textContent = oldScript.textContent
          document.body.appendChild(newScript)
          oldScript.remove()
        })
        document.body.appendChild(container)
      })
      .catch(() => {}) // silently fail — chat is non-critical
  }, [])

  return null
}
