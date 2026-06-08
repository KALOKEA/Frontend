'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useCartStore } from '@/lib/store/useCartStore'
import { useToast } from '@/components/ui/Toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function SignupContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { setAuth } = useAuthStore()
  const { toast } = useToast()

  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const isEmail = identifier.includes('@')

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast('Please enter your full name', 'error'); return }
    if (!identifier.trim()) { toast('Please enter your email or phone', 'error'); return }
    if (!acceptedTerms) { toast('Please accept the Terms & Conditions to continue', 'error'); return }

    setLoading(true)
    try {
      await authApi.sendOtp(isEmail ? { email: identifier } : { phone: identifier })
      toast('OTP sent! Check your ' + (isEmail ? 'email' : 'phone'))
      setStep('otp')
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
        isEmail
          ? { email: identifier, otp, accepted_terms: true, name: name.trim() }
          : { phone: identifier, otp, accepted_terms: true, name: name.trim() }
      )
      setAuth(res.access_token, { ...res.user, name: name.trim() })
      await useCartStore.getState().mergeOnLogin().catch(() => {})
      toast('Welcome to Kalokea, ' + name.split(' ')[0] + '! 🎉')
      const redirect = params.get('redirect') || '/'
      router.push(redirect)
    } catch (err) {
      toast((err as Error).message || 'Invalid OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Create Account</h1>
          <p className="text-sm font-sans text-[#6b6b6b]">Join Kalokea to track orders and save your details</p>
        </div>

        {step === 'details' ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <Input
              label="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Priya Sharma"
              required
              autoFocus
            />
            <Input
              label="Phone or Email"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="+91 9999999999 or email@example.com"
              required
            />
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 accent-[#0a0a0a] w-4 h-4 shrink-0"
              />
              <span className="text-[11px] font-sans text-[#6b6b6b] leading-relaxed">
                I agree to Kalokea&rsquo;s{' '}
                <Link href="/terms" className="text-[#0a0a0a] underline hover:text-[#7C4A2D]" target="_blank">
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-[#0a0a0a] underline hover:text-[#7C4A2D]" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </label>
            <Button type="submit" loading={loading} className="w-full" disabled={!acceptedTerms}>
              Send OTP
            </Button>

            <p className="text-center text-[11px] font-sans text-[#9b9b9b] pt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0a0a0a] underline hover:text-[#7C4A2D]">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="bg-[#faf8f5] border border-[#e8e4e0] px-4 py-3 text-center">
              <p className="text-[11px] font-sans text-[#6b6b6b]">OTP sent to</p>
              <p className="text-sm font-sans text-[#0a0a0a] font-medium mt-0.5">{identifier}</p>
            </div>
            <Input
              label="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="6-digit code"
              maxLength={6}
              inputMode="numeric"
              required
              autoFocus
            />
            <Button type="submit" loading={loading} className="w-full">
              Verify &amp; Create Account
            </Button>
            <button
              type="button"
              onClick={() => { setStep('details'); setOtp('') }}
              className="w-full text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
            >
              ← Change email / phone
            </button>
          </form>
        )}

      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  )
}
