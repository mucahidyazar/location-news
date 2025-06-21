import type {Metadata, Viewport} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import './marker-styles.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LocationNews - News on Interactive Map',
  description:
    'Discover location-based news articles on an interactive map with advanced filtering by categories, sources, and date ranges.',
  keywords: ['news', 'location', 'interactive map', 'turkey', 'haberler', 'konum', 'interaktif harita'],
  authors: [{ name: 'LocationNews Team' }],
  creator: 'LocationNews',
  publisher: 'LocationNews',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://location-news.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LocationNews - News on Interactive Map',
    description: 'Discover location-based news articles on an interactive map with advanced filtering by categories, sources, and date ranges.',
    url: 'https://location-news.vercel.app',
    siteName: 'LocationNews',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'LocationNews Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocationNews - News on Interactive Map',
    description: 'Discover location-based news articles on an interactive map with advanced filtering by categories, sources, and date ranges.',
    images: ['/logo.svg'],
    creator: '@locationnews',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="LocationNews" />
        <meta name="application-name" content="LocationNews" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="mucahidyazar"
          data-description="Support me on Buy me a coffee!"
          data-message="Thank you for visiting. You can support me to buy a coffee for me."
          data-color="#FF813F"
          data-position="Right"
          data-x_margin="60"
          data-y_margin="28"
          async
        ></script>
      </body>
    </html>
  )
}
