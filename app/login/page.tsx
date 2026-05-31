'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useToast } from '@/components/ui/Toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { setAuth } = useAuthStore()
  const { toast } = useToast()

  const [step, setStep] = useState<'send' | 'verify'>('send')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const isEmail = identifier.includes('@')

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.sendOtp(isEmail ? { email: identifier } : { phone: identifier })
      toast('OTP sent successfully')
      setStep('verify')
    } catch (err) {
      toast((err as Error).message || 'Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.verifyOtp(
        isEmail ? { email: identifier, otp } : { phone: identifier, otp }
      )
      setAuth(res.access_token, res.user)
      toast('Welcome back!')
      const redirect = params.get('redirect') || '/'
      router.push(redirect)
    } catch (err) {
      toast((err as Error).message || 'Invalid OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Sign In</h1>
          <p className="text-sm font-sans text-[#6b6b6b]">Enter your phone or email to continue</p>
        </div>

        {step === 'send' ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <Input
              label="Phone or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="+91 9999999999 or email@example.com"
              required
              autoFocus
            />
            <Button type="submit" loading={loading} className="w-full">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="text-center mb-2">
              <p className="text-xs font-sans text-[#6b6b6b]">OTP sent to <span className="text-[#0a0a0a] font-medium">{identifier}</span></p>
            </div>
            <Input
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              maxLength={6}
              inputMode="numeric"
              required
              autoFocus
            />
            <Button type="submit" loading={loading} className="w-full">
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => setStep('send')}
              className="w-full text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-[#0a0a0a]"
            >
              Change number / email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
