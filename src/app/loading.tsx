import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Image
            src="/logo.svg"
            alt="mappy.news"
            width={64}
            height={64}
            className="animate-pulse"
          />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-blue-500"></div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Loading...
          </h2>
          <p className="text-sm text-gray-500">
            Preparing your location-based news
          </p>
        </div>
      </div>
    </div>
  )
}
