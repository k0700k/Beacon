import AuthForm from './AuthForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sign In — Nexus',
  description: 'Sign in to your Nexus account or create a new one.',
}

export default function LoginPage() {
  return <AuthForm />
}
