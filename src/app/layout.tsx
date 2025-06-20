import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="LocationNews" />

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
