import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

function parseList(v?: string | null): string[] {
  return (v ?? '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

const adminEmails = parseList(process.env.ADMIN_EMAILS)
const allowGmailDev = (process.env.ALLOW_GMAIL_DEV ?? '').toLowerCase() === 'true'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: 'consent', access_type: 'offline', response_type: 'code' } },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = (profile?.email ?? '').toLowerCase()

      // If explicitly configured, only allow these emails.
      if (adminEmails.length > 0) return adminEmails.includes(email)

      // Default: allow Latimore legacy domain or Gmail.
      if (email.endsWith('@latimorelegacy.com')) return true
      if (email.endsWith('@gmail.com')) return true

      return false
    },
  },
  pages: { signIn: '/login' },
}
