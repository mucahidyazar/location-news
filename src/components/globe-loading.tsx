'use client'

import React, { useEffect, useState } from 'react'
import { MapPin, Sword, Zap, Flame } from 'lucide-react'

interface AnimatedIcon {
  id: string
  type: 'pin' | 'sword' | 'zap' | 'flame'
  x: number
  y: number
  delay: number
}

const GlobeLoading = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([])

  useEffect(() => {
    const iconTypes: Array<'pin' | 'sword' | 'zap' | 'flame'> = ['pin', 'sword', 'zap', 'flame']
    
    const generateIcons = () => {
      const newIcons: AnimatedIcon[] = []
      
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * (Math.PI / 180) // 30 degrees apart
        const latitude = Math.random() * 140 - 70 // -70 to 70 degrees
        const longitude = angle * (180 / Math.PI) // Convert back to degrees
        
        // Convert to screen coordinates (simplified projection)
        const x = ((longitude + 180) / 360) * 100
        const y = ((latitude + 90) / 180) * 100
        
        newIcons.push({
          id: `icon-${i}`,
          type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
          x,
          y,
          delay: i * 0.5
        })
      }
      
      setIcons(newIcons)
    }

    generateIcons()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'pin':
        return <MapPin className="w-4 h-4 text-red-500" />
      case 'sword':
        return <Sword className="w-4 h-4 text-blue-500" />
      case 'zap':
        return <Zap className="w-4 h-4 text-yellow-500" />
      case 'flame':
        return <Flame className="w-4 h-4 text-orange-500" />
      default:
        return <MapPin className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="relative">
        {/* Globe Container */}
        <div className="globe-container">
          {/* Globe */}
          <div className="globe">
            {/* World Map SVG */}
            <div className="world-map">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full"
              >
                {/* Simplified world map paths */}
                <g className="continents">
                  {/* North America */}
                  <path
                    d="M30 60 L60 50 L80 70 L60 90 L30 80 Z"
                    fill="rgba(34, 197, 94, 0.6)"
                    stroke="rgba(34, 197, 94, 0.8)"
                  />
                  {/* South America */}
                  <path
                    d="M50 100 L70 110 L65 140 L45 135 Z"
                    fill="rgba(34, 197, 94, 0.6)"
                    stroke="rgba(34, 197, 94, 0.8)"
                  />
                  {/* Europe */}
                  <path
                    d="M90 50 L110 45 L115 60 L95 65 Z"
                    fill="rgba(34, 197, 94, 0.6)"
                    stroke="rgba(34, 197, 94, 0.8)"
                  />
                  {/* Africa */}
                  <path
                    d="M85 70 L110 75 L105 120 L90 115 Z"
                    fill="rgba(34, 197, 94, 0.6)"
                    stroke="rgba(34, 197, 94, 0.8)"
                  />
                  {/* Asia */}
                  <path
                    d="M120 40 L160 35 L170 80 L125 75 Z"
                    fill="rgba(34, 197, 94, 0.6)"
                    stroke="rgba(34, 197, 94, 0.8)"
                  />
                  {/* Australia */}
                  <path
                    d="M140 120 L170 125 L165 140 L145 135 Z"
                    fill="rgba(34, 197, 94, 0.6)"
                    stroke="rgba(34, 197, 94, 0.8)"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Animated Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {icons.map((icon) => (
            <div
              key={icon.id}
              className="absolute animate-icon-drop"
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                animationDelay: `${icon.delay}s`
              }}
            >
              {getIcon(icon.type)}
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="text-white text-lg font-semibold">
            <span className="animate-pulse">Loading</span>
            <span className="animate-bounce inline-block ml-1">.</span>
            <span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.1s' }}>.</span>
            <span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.2s' }}>.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobeLoading