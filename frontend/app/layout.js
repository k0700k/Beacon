import { Geist } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/layout/Layout'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata = {
  title: 'Nexus Auth',
  description: 'Secure authentication powered by Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
