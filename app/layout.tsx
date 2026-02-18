import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Latimore Life & Legacy LLC | Independent Insurance Advisor',
  description: 'Clear, education-first life insurance and annuity plans for families across Schuylkill, Luzerne & Northumberland Counties in Pennsylvania.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T84YFJN2Y9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T84YFJN2Y9');
          `}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
