'use client'

import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    require: any
  }
}

interface ArcGISGlobeLoadingProps {
  className?: string
}

const ArcGISGlobeLoading: React.FC<ArcGISGlobeLoadingProps> = ({ className = '' }) => {
  const viewDivRef = useRef<HTMLDivElement>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showMarkers, setShowMarkers] = useState(false)

  useEffect(() => {
    if (isScriptLoaded && viewDivRef.current && !isInitialized) {
      initializeGlobe()
      setIsInitialized(true)
    }
  }, [isScriptLoaded, isInitialized])

  const initializeGlobe = () => {
    const { require } = window
    
    require([
      'esri/Map',
      'esri/views/SceneView',
      'esri/layers/TileLayer',
      'esri/Basemap',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/geometry/Mesh',
      'esri/core/watchUtils'
    ], (Map: any, SceneView: any, TileLayer: any, Basemap: any, Graphic: any, Point: any, Mesh: any, watchUtils: any) => {
      
      const R = 6358137 // approximate radius of the Earth in m
      const offset = 300000 // offset from the ground used for the clouds

      const basemap = new Basemap({
        baseLayers: [
          new TileLayer({
            url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/terrain_with_heavy_bathymetry/MapServer",
            copyright: "Bathymetry, topography and satellite imagery from NASA Visible Earth"
          })
        ]
      })

      const map = new Map({
        basemap: basemap
      })

      const view = new SceneView({
        container: viewDivRef.current,
        map: map,
        alphaCompositingEnabled: true,
        qualityProfile: "high",
        camera: {
          position: [-55.03975781, 14.94826384, 19921223.30821],
          heading: 2.03,
          tilt: 0.13
        },
        environment: {
          background: {
            type: "color",
            color: [255, 252, 244, 0] // Same background as Globe of Extremes
          },
          starsEnabled: false,
          atmosphereEnabled: false,
          lighting: {
            directShadowsEnabled: false,
            date: "Sun Jun 23 2019 19:19:18 GMT+0200 (Central European Summer Time)"
          }
        },
        constraints: {
          altitude: {
            min: 10000000,
            max: 25000000
          }
        }
      })

      // Remove navigation controls for clean look
      view.ui.remove("navigation-toggle")
      view.ui.remove("zoom")
      view.ui.remove("compass")
      view.ui.remove("attribution")

      // Create ocean surface with same color as Globe of Extremes
      const origin = new Point({
        x: 0, y: -90, z: -(2 * R)
      })

      const oceanSurfaceMesh = Mesh.createSphere(
        origin, {
        size: {
          width: 2 * R,
          depth: 2 * R,
          height: 2 * R
        },
        densificationFactor: 5,
        material: {
          color: [0, 210, 210, 0.8], // Same cyan color as Globe of Extremes
          metallic: 0.9,
          roughness: 0.8,
          doubleSided: false
        }
      })

      const oceanSurface = new Graphic({
        geometry: oceanSurfaceMesh,
        symbol: {
          type: "mesh-3d",
          symbolLayers: [{
            type: "fill"
          }]
        }
      })

      view.graphics.add(oceanSurface)

      // Auto-rotate the globe
      view.when(() => {
        watchUtils.whenFalseOnce(view, "updating", rotate)
        // Show markers after globe is loaded
        setTimeout(() => {
          setShowMarkers(true)
        }, 2000)
      })

      function rotate() {
        if (!view.interacting) {
          const camera = view.camera.clone()
          camera.position.longitude -= 0.2
          view.goTo(camera, { animate: false })
          requestAnimationFrame(rotate)
        }
      }
    })
  }

  const handleScriptLoad = () => {
    setIsScriptLoaded(true)
  }

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://js.arcgis.com/4.22/esri/themes/light/main.css" 
      />
      <Script
        src="https://js.arcgis.com/4.22/"
        onLoad={handleScriptLoad}
        strategy="lazyOnload"
      />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative w-[500px] h-[500px] arcgis-globe-container">
          <div 
            ref={viewDivRef} 
            className="h-full w-full arcgis-globe-canvas"
          />
          
          {/* Loading overlay */}
          {!isInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#12bff2] to-[#0269a1] rounded-full">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <h2 className="text-xl font-bold mb-2">Loading Globe</h2>
                <p className="text-sm opacity-80">Initializing world map...</p>
              </div>
            </div>
          )}
          
          {/* Floating Markers */}
          {showMarkers && (
            <>
              {/* Pin 1 - Top right */}
              <div 
                className="absolute top-[80px] right-[100px] animate-icon-drop"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
              </div>
              
              {/* Pin 2 - Left center */}
              <div 
                className="absolute top-[200px] left-[80px] animate-icon-drop"
                style={{ animationDelay: '1s' }}
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
              </div>
              
              {/* Pin 3 - Bottom center */}
              <div 
                className="absolute bottom-[120px] left-[180px] animate-icon-drop"
                style={{ animationDelay: '1.5s' }}
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              </div>
              
              {/* Pin 4 - Top left */}
              <div 
                className="absolute top-[120px] left-[150px] animate-icon-drop"
                style={{ animationDelay: '2s' }}
              >
                <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 animate-pulse"></div>
              </div>
              
              {/* Pin 5 - Right center */}
              <div 
                className="absolute top-[250px] right-[80px] animate-icon-drop"
                style={{ animationDelay: '2.5s' }}
              >
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
              </div>
              
              {/* Pin 6 - Bottom right */}
              <div 
                className="absolute bottom-[100px] right-[120px] animate-icon-drop"
                style={{ animationDelay: '3s' }}
              >
                <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 animate-pulse"></div>
              </div>
            </>
          )}
        </div>
        
        {/* Loading Text */}
        <div className="mt-8 text-black text-lg font-semibold">
          <span className="animate-pulse">Loading</span>
          <span className="animate-bounce inline-block ml-1">.</span>
          <span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.2s' }}>.</span>
        </div>
        
        {/* 2D Icons Legend */}
        <div className="mt-6 flex gap-6 text-black text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Locations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>Incidents</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ArcGISGlobeLoading