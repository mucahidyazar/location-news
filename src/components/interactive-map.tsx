'use client'

import {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import {Location, NewsItem} from '@/lib/types'
import {
  getCategoryKeyByName,
  getCategoryColorByKey,
  getCategoryIcon,
} from '@/lib/category-colors'
import {useTranslations} from 'next-intl'
import {useMainLayout} from '@/contexts/main-layout-context'

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  {ssr: false},
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  {ssr: false},
)
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false,
})
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
})
const ZoomControl = dynamic(
  () => import('react-leaflet').then(mod => mod.ZoomControl),
  {ssr: false},
)

interface InteractiveMapProps {
  locations: Location[]
  filteredNews: NewsItem[]
  selectedLocation?: string
  selectedCategory?: string
  onLocationSelect: (location: string) => void
  useCustomIcons: boolean
}

export default function InteractiveMap({
  filteredNews,
  onLocationSelect,
  useCustomIcons,
}: InteractiveMapProps) {
  const t = useTranslations()
  const {isSidebarOpen, isSettingsSidebarOpen, isUpdatesSidebarOpen, isMenuSidebarOpen} = useMainLayout()
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [leafletReady, setLeafletReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // Dynamically import Leaflet on client side
    import('leaflet')
      .then(leaflet => {
        setL(leaflet.default)
        setLeafletReady(true)
      })
      .catch(error => {
        console.error('Failed to load Leaflet:', error)
      })
  }, [])

  // Handle sidebar state changes to resize map
  useEffect(() => {
    if (mapInstance && leafletReady) {
      const timer = setTimeout(() => {
        try {
          mapInstance.invalidateSize()
        } catch (error) {
          console.error('Error invalidating map size:', error)
        }
      }, 550) // Match the CSS transition duration (500ms) + small buffer
      
      return () => clearTimeout(timer)
    }
  }, [isSidebarOpen, isSettingsSidebarOpen, isUpdatesSidebarOpen, isMenuSidebarOpen, mapInstance, leafletReady])

  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance && leafletReady) {
        try {
          mapInstance.invalidateSize()
        } catch (error) {
          console.error('Error invalidating map size on resize:', error)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mapInstance, leafletReady])

  const getCategoryIconName = (categoryName: string): string => {
    // Get the key for this category name, then get the icon from the key-based system
    const categoryKey = getCategoryKeyByName(categoryName)
    const iconName = getCategoryIcon(categoryKey)
    return iconName
  }

  const createSimpleIcon = (color: string) => {
    if (!L || !L.divIcon || !leafletReady) return undefined

    try {
      return L.divIcon({
        className: 'simple-marker',
        html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
          z-index: 1000;
        "></div>
      `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      })
    } catch (error) {
      console.error('Error creating simple icon:', error)
      return undefined
    }
  }

  const createCategoryIcon = (category: string, color: string) => {
    if (!L || !L.divIcon || !leafletReady) return undefined

    if (!useCustomIcons) {
      return createSimpleIcon(color)
    }

    const iconName = getCategoryIconName(category)
    const iconPath = getIconPath(iconName)

    try {
      return L.divIcon({
        className: 'custom-marker',
        html: `
        <div style="
          background-color: ${color};
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          position: relative;
          z-index: 1000;
        ">
          <svg width="18" height="18" viewBox="0 0 120 120" style="fill: white; stroke: none; overflow: visible;" xmlns="http://www.w3.org/2000/svg">
            <path d="${iconPath}" fill="white" stroke="none"/>
          </svg>
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid ${color};
          "></div>
        </div>
      `,
        iconSize: [35, 43],
        iconAnchor: [17, 43],
        popupAnchor: [0, -43],
      })
    } catch (error) {
      console.error('Error creating category icon:', error, {
        category,
        iconName,
        color,
      })
      return createSimpleIcon(color) // Fallback to simple icon
    }
  }

  const getIconPath = (iconName: string): string => {
    const iconPaths: Record<string, string> = {
      // Original icons
      'angry-man':
        'M60 15C36.8 15 18.75 33.05 18.75 56.25C18.75 79.45 36.8 97.5 60 97.5C83.2 97.5 101.25 79.45 101.25 56.25C101.25 33.05 83.2 15 60 15ZM60 26.25C77.6 26.25 90 38.65 90 56.25C90 73.85 77.6 86.25 60 86.25C42.4 86.25 30 73.85 30 56.25C30 38.65 42.4 26.25 60 26.25ZM48.75 41.25C45.45 41.25 42.75 43.95 42.75 47.25C42.75 50.55 45.45 53.25 48.75 53.25C52.05 53.25 54.75 50.55 54.75 47.25C54.75 43.95 52.05 41.25 48.75 41.25ZM71.25 41.25C67.95 41.25 65.25 43.95 65.25 47.25C65.25 50.55 67.95 53.25 71.25 53.25C74.55 53.25 77.25 50.55 77.25 47.25C77.25 43.95 74.55 41.25 71.25 41.25ZM41.25 67.5C44.55 67.5 56.7 67.5 60 67.5C63.3 67.5 75.45 67.5 78.75 67.5C81.45 67.5 83.7 65.25 83.7 62.55C83.7 59.85 81.45 57.6 78.75 57.6C75.45 57.6 63.3 57.6 60 57.6C56.7 57.6 44.55 57.6 41.25 57.6C38.55 57.6 36.3 59.85 36.3 62.55C36.3 65.25 38.55 67.5 41.25 67.5Z',
      'car-crash':
        'M20 45L35 30H85L100 45V75C100 77.75 97.75 80 95 80H90C87.25 80 85 77.75 85 75V70H35V75C35 77.75 32.75 80 30 80H25C22.25 80 20 77.75 20 75V45ZM40 35L30 45H90L80 35H40ZM35 50C32.25 50 30 52.25 30 55C30 57.75 32.25 60 35 60C37.75 60 40 57.75 40 55C40 52.25 37.75 50 35 50ZM85 50C82.25 50 80 52.25 80 55C80 57.75 82.25 60 85 60C87.75 60 90 57.75 90 55C90 52.25 87.75 50 85 50ZM15 20L25 25L20 35L10 30L15 20ZM105 20L115 30L105 35L100 25L105 20Z',
      'credit-card':
        'M20 30C17.25 30 15 32.25 15 35V85C15 87.75 17.25 90 20 90H100C102.75 90 105 87.75 105 85V35C105 32.25 102.75 30 100 30H20ZM20 40H100V50H20V40ZM20 60H100V80H20V60ZM25 65H45V75H25V65ZM50 65H70V75H50V65Z',
      drug: 'M42.5 25C40.15 25 38.25 26.9 38.25 29.25V37.5H22.5C20.15 37.5 18.25 39.4 18.25 41.75V78.25C18.25 80.6 20.15 82.5 22.5 82.5H97.5C99.85 82.5 101.75 80.6 101.75 78.25V41.75C101.75 39.4 99.85 37.5 97.5 37.5H81.75V29.25C81.75 26.9 79.85 25 77.5 25H42.5ZM42.5 35H77.5V37.5H42.5V35ZM28.75 47.5H91.25V72.5H28.75V47.5ZM37.5 52.5V67.5H45V52.5H37.5ZM52.5 52.5V67.5H60V52.5H52.5ZM67.5 52.5V67.5H75V52.5H67.5Z',
      family:
        'M40 25C35.05 25 31 29.05 31 34C31 38.95 35.05 43 40 43C44.95 43 49 38.95 49 34C49 29.05 44.95 25 40 25ZM80 25C75.05 25 71 29.05 71 34C71 38.95 75.05 43 80 43C84.95 43 89 38.95 89 34C89 29.05 84.95 25 80 25ZM40 49C29.45 49 21 57.45 21 68V85C21 87.75 23.25 90 26 90H54C56.75 90 59 87.75 59 85V68C59 57.45 50.55 49 40 49ZM80 49C69.45 49 61 57.45 61 68V85C61 87.75 63.25 90 66 90H94C96.75 90 99 87.75 99 85V68C99 57.45 90.55 49 80 49ZM60 55C57.25 55 55 57.25 55 60C55 62.75 57.25 65 60 65C62.75 65 65 62.75 65 60C65 57.25 62.75 55 60 55ZM60 71C55.05 71 51 75.05 51 80V95H69V80C69 75.05 64.95 71 60 71Z',
      'fire-and-explosion':
        'M60 15C54.45 15 50 19.45 50 25C50 30.55 54.45 35 60 35C65.55 35 70 30.55 70 25C70 19.45 65.55 15 60 15ZM35 25C32.25 25 30 27.25 30 30C30 32.75 32.25 35 35 35H45C47.75 35 50 32.75 50 30C50 27.25 47.75 25 45 25H35ZM75 25C72.25 25 70 27.25 70 30C70 32.75 72.25 35 75 35H85C87.75 35 90 32.75 90 30C90 27.25 87.75 25 85 25H75ZM25 45C22.25 45 20 47.25 20 50C20 52.75 22.25 55 25 55H35C37.75 55 40 52.75 40 50C40 47.25 37.75 45 35 45H25ZM45 45C42.25 45 40 47.25 40 50V85C40 92.25 45.75 98 53 98H67C74.25 98 80 92.25 80 85V50C80 47.25 77.75 45 75 45H45ZM85 45C82.25 45 80 47.25 80 50C80 52.75 82.25 55 85 55H95C97.75 55 100 52.75 100 50C100 47.25 97.75 45 95 45H85ZM50 55H70V85C70 86.65 68.65 88 67 88H53C51.35 88 50 86.65 50 85V55Z',
      magnify:
        'M50 20C34.5 20 22 32.5 22 48C22 63.5 34.5 76 50 76C56.1 76 61.7 74.3 66.4 71.3L91.6 96.5C93.2 98.1 95.8 98.1 97.4 96.5C99 94.9 99 92.3 97.4 90.7L72.2 65.5C75.2 60.8 76.9 55.2 76.9 49.1C76.9 33.6 64.4 21.1 49.9 21.1L50 20ZM50 30C58.8 30 66 37.2 66 46C66 54.8 58.8 62 50 62C41.2 62 34 54.8 34 46C34 37.2 41.2 30 50 30Z',
      mask: 'M79.15 49.0417C73.5 48.4917 68.45 51.8917 67.3 57.4917C67.3 59.1917 74.05 61.4417 80.25 61.4417C86.45 61.4417 92.05 57.4917 92.05 56.3917C92.05 55.2417 88.15 49.6417 79.15 49.0417ZM40.9 49.0417C31.9 49.6417 27.95 54.6917 27.95 56.3417C27.95 57.4917 34.1 61.4417 39.75 61.4417C45.4 61.4417 52.7 59.1917 52.7 57.4917C51.55 51.8917 45.95 48.4917 40.9 49.0417ZM84.75 79.9917C75.2 79.9917 69 68.7417 60 68.7417C51 68.7417 44.25 79.9917 35.25 79.9917C23.45 79.9917 15 69.2917 15 50.1917C15 38.3917 18.4 34.9917 33.55 34.9917C48.7 34.9917 52.7 41.1917 60 41.1917C67.3 41.1917 71.8 34.9917 86.45 34.9917C101.1 34.9917 105 38.9417 105 50.1917C105 69.2917 96.55 79.9917 84.75 79.9917Z',
      pistol:
        'M30 40C27.25 40 25 42.25 25 45V65C25 67.75 27.25 70 30 70H35V75C35 77.75 37.25 80 40 80H50C52.75 80 55 77.75 55 75V70H80C85.55 70 90 65.55 90 60V50C90 44.45 85.55 40 80 40H70V35C70 32.25 67.75 30 65 30H60V25C60 22.25 57.75 20 55 20H45C42.25 20 40 22.25 40 25V30H35C32.25 30 30 32.25 30 35V40ZM35 40H60V35H55V30H45V35H40V40H35ZM35 50H80V60H35V50Z',
      'shield-star':
        'M60 15L30 25V50C30 70 45 87.5 60 95C75 87.5 90 70 90 50V25L60 15ZM60 30L65 40H75L67.5 47.5L70 57.5L60 52.5L50 57.5L52.5 47.5L45 40H55L60 30Z',
      storm:
        'M85 35C76.15 35 69 42.15 69 51C68.45 51 67.9 51 67.35 51.05C65.35 43.8 58.85 38.5 51 38.5C41.05 38.5 33 46.55 33 56.5C33 57.05 33 57.6 33.05 58.15C28.9 59.7 26 63.65 26 68.5C26 74.3 30.7 79 36.5 79H80.5C89.05 79 96 72.05 96 63.5C96 55.4 89.6 48.8 81.7 48.05C83.55 44.75 85 40.55 85 35ZM55 50L45 70H55L50 85L60 65H50L55 50Z',
      // New icons
      'graduation-cap':
        'M60 20L15 40L60 60L95 45V70H105V40L60 20ZM30 48.5V68.5C30 75 42.5 85 60 85C77.5 85 90 75 90 68.5V48.5L60 62L30 48.5Z',
      tv: 'M20 30C17.25 30 15 32.25 15 35V85C15 87.75 17.25 90 20 90H100C102.75 90 105 87.75 105 85V35C105 32.25 102.75 30 100 30H20ZM25 40H95V75H25V40ZM45 20H75V25H45V20Z',
      leaf: 'M85 25C76.4 25 68.8 28.8 63.5 35C58.2 28.8 50.6 25 42 25C28.2 25 17 36.2 17 50C17 63.8 28.2 75 42 75C50.6 75 58.2 71.2 63.5 65C68.8 71.2 76.4 75 85 75C98.8 75 110 63.8 110 50C110 36.2 98.8 25 85 25ZM42 35C44.8 35 47 37.2 47 40C47 42.8 44.8 45 42 45C39.2 45 37 42.8 37 40C37 37.2 39.2 35 42 35ZM85 35C87.8 35 90 37.2 90 40C90 42.8 87.8 45 85 45C82.2 45 80 42.8 80 40C80 37.2 82.2 35 85 35Z',
      heart:
        'M34 20C22.95 20 14 28.95 14 40C14 51.05 22.95 60 34 60H42L60 78L78 60H86C97.05 60 106 51.05 106 40C106 28.95 97.05 20 86 20C79.75 20 74.35 23.25 71.5 28.25C68.65 23.25 63.25 20 57 20C50.75 20 45.35 23.25 42.5 28.25C39.65 23.25 34.25 20 28 20Z',
      government:
        'M60 15L20 35V40H100V35L60 15ZM30 45V85H35V50H45V85H50V50H60V85H65V50H75V85H80V50H90V85H95V45H30Z',
      flask:
        'M42.5 20C40.15 20 38.25 21.9 38.25 24.25V30H45V24.25C45 21.9 43.1 20 40.75 20H42.5ZM52.5 20V30H59.25V24.25C59.25 21.9 57.35 20 55 20H52.5ZM67.5 20C65.15 20 63.25 21.9 63.25 24.25V30H70V24.25C70 21.9 68.1 20 65.75 20H67.5ZM77.5 20V30H84.25V24.25C84.25 21.9 82.35 20 80 20H77.5ZM25 35V40H95V35H25ZM30 45V85H90V45H30ZM40 55H80V75H40V55Z',
      ball: 'M60 15C36.8 15 18.25 33.55 18.25 56.75C18.25 79.95 36.8 98.5 60 98.5C83.2 98.5 101.75 79.95 101.75 56.75C101.75 33.55 83.2 15 60 15ZM30 35L90 35C92.75 35 95 37.25 95 40C95 42.75 92.75 45 90 45L30 45C27.25 45 25 42.75 25 40C25 37.25 27.25 35 30 35ZM30 55L90 55C92.75 55 95 57.25 95 60C95 62.75 92.75 65 90 65L30 65C27.25 65 25 62.75 25 60C25 57.25 27.25 55 30 55ZM30 75L90 75C92.75 75 95 77.25 95 80C95 82.75 92.75 85 90 85L30 85C27.25 85 25 82.75 25 80C25 77.25 27.25 75 30 75Z',
      computer:
        'M20 25C17.25 25 15 27.25 15 30V75C15 77.75 17.25 80 20 80H50V85H40C37.25 85 35 87.25 35 90C35 92.75 37.25 95 40 95H80C82.75 95 85 92.75 85 90C85 87.25 82.75 85 80 85H70V80H100C102.75 80 105 77.75 105 75V30C105 27.25 102.75 25 100 25H20ZM25 35H95V70H25V35Z',
      'newspaper-sharp':
        'M20 20V100H100V30H90V90H30V20H20ZM40 30V40H80V30H40ZM40 50V55H80V50H40ZM40 60V65H80V60H40ZM40 70V75H65V70H40Z',
    }

    const path = iconPaths[iconName] || iconPaths['newspaper-sharp']
    return path
  }

  if (!isClient || !leafletReady) {
    return (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">{t('map.loading')}</div>
      </div>
    )
  }

  return (
    <div className="h-full rounded-lg overflow-hidden relative transition-all duration-500 ease-out">
      <MapContainer
        center={[39.9334, 32.8597]}
        zoom={6}
        className="h-full w-full"
        style={{zIndex: 1}}
        zoomControl={false}
        ref={(map) => {
          if (map && !mapInstance) {
            setMapInstance(map)
          }
        }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredNews.map((news) => {
          // Skip news without coordinates
          if (!news.latitude || !news.longitude) {
            return null
          }

          // Get category for this news
          const categoryName = typeof news.category === 'string' ? news.category : news.category?.name || ''
          
          // Use key-based system for better multilingual support
          const categoryKey = categoryName
            ? getCategoryKeyByName(categoryName)
            : 'other_incidents'
          const categoryColors = getCategoryColorByKey(categoryKey)
          const categoryColor = categoryColors.pin


          const icon = createCategoryIcon(
            categoryName || 'Diğer Olaylar',
            categoryColor,
          )

          // Skip marker if icon creation failed (L not ready)
          if (!icon) {
            return null
          }

          return (
            <Marker
              key={`news-${news.id}`}
              position={[news.latitude, news.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onLocationSelect(typeof news.location === 'string' ? news.location : ''),
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold text-lg">{news.title}</h3>
                  <p className="text-sm text-gray-600">
                    {typeof news.location === 'string' ? news.location : ''}
                    {categoryName && (
                      <span className="block text-xs text-gray-500">
                        {categoryName}
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => onLocationSelect(typeof news.location === 'string' ? news.location : '')}
                    style={{
                      marginTop: '8px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      width: '100%',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#10b981'}
                  >
                    {t('map.viewNews')}
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
