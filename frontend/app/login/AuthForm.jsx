'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { createClient } from '@/utils/supabase/client'
import { login, signup, signInWithGoogle } from '@/app/actions'

// Generate nonce for Google One Tap
const generateNonce = async () => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return [nonce, hashedNonce]
}

export default function AuthForm() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, startGoogleTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    const formData = new FormData(e.target)

    startTransition(async () => {
      const action = mode === 'login' ? login : signup
      const result = await action(formData)
      if (result?.error) {
        setErrorMsg(result.error)
      } else if (mode === 'register') {
        setSuccessMsg('Account created! Check your email to confirm your account.')
      }
    })
  }

  const handleGoogleSignIn = () => {
    setErrorMsg('')
    startGoogleTransition(async () => {
      const result = await signInWithGoogle()
      if (result?.error) {
        setErrorMsg(result.error)
      }
    })
  }

  // Initialize Google One Tap
  const initializeGoogleOneTap = async () => {
    // FedCM (used by Google One Tap) requires HTTPS — skip in local development
    if (window.location.protocol !== 'https:') return

    const [nonce, hashedNonce] = await generateNonce()

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push('/')
      return
    }

    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            })
            if (error) throw error
            router.push('/')
          } catch (err) {
            setErrorMsg('Google One Tap sign-in failed. Please try again.')
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      })
      window.google.accounts.id.prompt()
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={initializeGoogleOneTap}
        strategy="afterInteractive"
      />

      <div className="auth-wrapper">
        {/* Background animated blobs */}
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-3" />

        <div className="auth-card">
          {/* Logo / Brand */}
          <div className="auth-brand">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="10" fill="url(#brand-grad)" />
                <path d="M16 7L23 12V20L16 25L9 20V12L16 7Z" fill="white" opacity="0.9" />
                <defs>
                  <linearGradient id="brand-grad" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="brand-name">Nexus</span>
          </div>

          {/* Tab Toggle */}
          <div className="auth-tabs">
            <button
              id="tab-login"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg('') }}
              type="button"
            >
              Sign In
            </button>
            <button
              id="tab-register"
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg('') }}
              type="button"
            >
              Register
            </button>
            <div className={`tab-indicator ${mode === 'register' ? 'right' : 'left'}`} />
          </div>

          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to continue to your workspace'
              : 'Get started for free today'}
          </p>

          {/* Google OAuth Button */}
          <button
            id="btn-google"
            type="button"
            className="google-btn"
            onClick={handleGoogleSignIn}
            disabled={isGooglePending || isPending}
          >
            {isGooglePending ? (
              <span className="spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" className="google-icon">
                <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.4a4.6 4.6 0 01-2 3.02v2.52h3.23c1.89-1.74 2.97-4.3 2.97-7.33z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.23-2.52c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.07v2.6A10 10 0 0010 20z" fill="#34A853"/>
                <path d="M4.41 11.9A6 6 0 014.1 10c0-.66.11-1.3.31-1.9V5.5H1.07A10 10 0 000 10c0 1.61.39 3.14 1.07 4.5l3.34-2.6z" fill="#FBBC05"/>
                <path d="M10 3.96c1.47 0 2.79.51 3.83 1.5l2.87-2.87C14.95.99 12.69 0 10 0A10 10 0 001.07 5.5l3.34 2.6C5.2 5.72 7.4 3.96 10 3.96z" fill="#EA4335"/>
              </svg>
            )}
            <span>{isGooglePending ? 'Redirecting...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="form-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'}
                  required
                  minLength={mode === 'register' ? 8 : undefined}
                  className="form-input"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {/* Error / Success Messages */}
            {errorMsg && (
              <div className="alert alert-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {successMsg}
              </div>
            )}

            <button
              id="btn-submit"
              type="submit"
              className="submit-btn"
              disabled={isPending || isGooglePending}
            >
              {isPending ? (
                <>
                  <span className="spinner" />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>

          <p className="auth-footer">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="auth-link"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrorMsg(''); setSuccessMsg('') }}
            >
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
