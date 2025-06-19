export const categoryColors = {
  'Ulaştırma': {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    pin: '#3B82F6',
    hex: '#3B82F6'
  },
  'Teknoloji': {
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    pin: '#8B5CF6',
    hex: '#8B5CF6'
  },
  'Kültür': {
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
    pin: '#EC4899',
    hex: '#EC4899'
  },
  'Sağlık': {
    badge: 'bg-green-100 text-green-800 border-green-200',
    pin: '#10B981',
    hex: '#10B981'
  },
  'Turizm': {
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pin: '#F59E0B',
    hex: '#F59E0B'
  },
  'Tarım': {
    badge: 'bg-lime-100 text-lime-800 border-lime-200',
    pin: '#84CC16',
    hex: '#84CC16'
  },
  'Spor': {
    badge: 'bg-red-100 text-red-800 border-red-200',
    pin: '#EF4444',
    hex: '#EF4444'
  },
  'Çevre': {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pin: '#059669',
    hex: '#059669'
  },
  'Suç': {
    badge: 'bg-red-100 text-red-900 border-red-300',
    pin: '#DC2626',
    hex: '#DC2626'
  },
  'Katliam': {
    badge: 'bg-red-200 text-red-900 border-red-400',
    pin: '#991B1B',
    hex: '#991B1B'
  },
  'Savaş': {
    badge: 'bg-orange-100 text-orange-900 border-orange-300',
    pin: '#EA580C',
    hex: '#EA580C'
  },
  'Oyunlar': {
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    pin: '#6366F1',
    hex: '#6366F1'
  }
} as const;

export const getCategoryColor = (category: string) => {
  return categoryColors[category as keyof typeof categoryColors] || {
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
    pin: '#6B7280',
    hex: '#6B7280'
  };
};

export const categories = [
  'Tümü',
  'Ulaştırma',
  'Teknoloji', 
  'Kültür',
  'Sağlık',
  'Turizm',
  'Tarım',
  'Spor',
  'Çevre',
  'Suç',
  'Katliam',
  'Savaş',
  'Oyunlar'
] as const;