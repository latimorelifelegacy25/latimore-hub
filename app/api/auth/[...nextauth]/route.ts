import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: 'consent', access_type: 'offline', response_type: 'code' } },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // Allow your domain + gmail for dev
      const allowed = ['latimorelegacy.com', 'gmail.com']
      const email = (profile?.email ?? '').toLowerCase()
      return allowed.some(d => email.endsWith('@' + d))
    },
  },
  pages: { signIn: '/admin/login' },
})

export { handler as GET, handler as POST }
