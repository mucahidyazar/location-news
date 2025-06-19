'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Location, NewsItem } from '@/lib/database';
import { getCategoryColor } from '@/lib/category-colors';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

interface InteractiveMapProps {
  locations: Location[];
  filteredNews: NewsItem[];
  selectedLocation?: string;
  selectedCategory?: string;
  onLocationSelect: (location: string) => void;
}

export default function InteractiveMap({ locations, filteredNews, selectedCategory, onLocationSelect }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const createColoredIcon = (color: string) => {
    if (!L) return undefined;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 25px;
          height: 25px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          transform: rotate(-45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [25, 25],
      iconAnchor: [12, 25],
      popupAnchor: [0, -25]
    });
  };

  if (!isClient) {
    return (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Harita yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[39.9334, 32.8597]} 
        zoom={6}
        className="h-full w-full"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => {
          // Filter news for this specific location
          const locationNews = filteredNews.filter(news => news.location === location.name);
          
          // Don't show pin if no filtered news for this location
          if (locationNews.length === 0) {
            return null;
          }
          
          // Get the most common category for this location from filtered news
          const categoryCount = locationNews.reduce((acc, news) => {
            acc[news.category] = (acc[news.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const primaryCategory = Object.entries(categoryCount)
            .sort(([, a], [, b]) => b - a)[0]?.[0];
          
          const categoryColor = primaryCategory 
            ? getCategoryColor(primaryCategory).pin 
            : '#6B7280';
          const icon = createColoredIcon(categoryColor);
          
          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onLocationSelect(location.name)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  <p className="text-sm text-gray-600">
                    {locationNews.length} haber
                    {primaryCategory && (
                      <span className="block text-xs text-gray-500">
                        Çoğu: {primaryCategory}
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => onLocationSelect(location.name)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Haberleri Gör
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}