import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getSiteSettings, resolveMedia } from '@/lib/payload'
import './styles.css'

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-face', display: 'swap' })

export const dynamic = 'force-dynamic'

export const viewport: Viewport = { themeColor: '#0a0a0b' }

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const share = resolveMedia(settings.shareImage)
  return {
    title: { default: settings.seoTitle ?? settings.businessName, template: `%s | ${settings.businessName}` },
    description: settings.seoDescription ?? undefined,
    icons: { icon: resolveMedia(settings.logoMark)?.url ?? '/brand/logo-mark.png' },
    openGraph: { images: share ? [share.url] : undefined },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const wordmark = resolveMedia(settings.logoWordmark)?.url ?? '/brand/logo-wordmark.png'

  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader
          businessName={settings.businessName}
          logoUrl={wordmark}
          links={(settings.navigation ?? []).map((l) => ({ label: l.label, url: l.url }))}
          bookLabel={settings.bookButtonLabel ?? 'Book Evo'}
          rentLabel={settings.rentButtonLabel ?? 'Rent gear'}
        />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} logoUrl={wordmark} />
      </body>
    </html>
  )
}
