import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mappy.news',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}