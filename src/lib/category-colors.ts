// Key-based category configuration for multilingual support
export const categoryConfig = {
  theft_robbery: {
    badge: 'bg-red-100 text-red-900 border-red-300',
    pin: '#DC2626',
    hex: '#DC2626',
    icon: 'mask',
    tr: 'Hırsızlık ve Gasp',
    en: 'Theft & Robbery'
  },
  fraud_scam: {
    badge: 'bg-orange-100 text-orange-900 border-orange-300',
    pin: '#B91C1C',
    hex: '#B91C1C',
    icon: 'credit-card',
    tr: 'Dolandırıcılık',
    en: 'Fraud & Scam'
  },
  violence: {
    badge: 'bg-red-200 text-red-900 border-red-400',
    pin: '#991B1B',
    hex: '#991B1B',
    icon: 'angry-man',
    tr: 'Şiddet',
    en: 'Violence'
  },
  sexual_crimes: {
    badge: 'bg-red-300 text-red-900 border-red-500',
    pin: '#7F1D1D',
    hex: '#7F1D1D',
    icon: 'shield-star',
    tr: 'Cinsel Suçlar',
    en: 'Sexual Crimes'
  },
  traffic_incidents: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    pin: '#EF4444',
    hex: '#EF4444',
    icon: 'car-crash',
    tr: 'Trafik Olayları',
    en: 'Traffic Incidents'
  },
  drug_crimes: {
    badge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    pin: '#F59E0B',
    hex: '#F59E0B',
    icon: 'drug',
    tr: 'Uyuşturucu Suçları',
    en: 'Drug Crimes'
  },
  domestic_violence: {
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    pin: '#DC2626',
    hex: '#DC2626',
    icon: 'family',
    tr: 'Aile İçi Şiddet',
    en: 'Domestic Violence'
  },
  fire_explosion: {
    badge: 'bg-orange-200 text-orange-900 border-orange-400',
    pin: '#EA580C',
    hex: '#EA580C',
    icon: 'fire-and-explosion',
    tr: 'Yangın ve Patlama',
    en: 'Fire & Explosion'
  },
  suicide_missing: {
    badge: 'bg-gray-100 text-gray-900 border-gray-300',
    pin: '#6B7280',
    hex: '#6B7280',
    icon: 'magnify',
    tr: 'İntihar ve Kayıp',
    en: 'Suicide & Missing'
  },
  terror_security: {
    badge: 'bg-red-400 text-red-900 border-red-600',
    pin: '#7C2D12',
    hex: '#7C2D12',
    icon: 'pistol',
    tr: 'Terör ve Güvenlik',
    en: 'Terror & Security'
  },
  natural_disaster: {
    badge: 'bg-blue-200 text-blue-900 border-blue-400',
    pin: '#0891B2',
    hex: '#0891B2',
    icon: 'storm',
    tr: 'Doğal Afet',
    en: 'Natural Disaster'
  },
  other_incidents: {
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
    pin: '#6B7280',
    hex: '#6B7280',
    icon: 'newspaper-sharp',
    tr: 'Diğer Olaylar',
    en: 'Other Incidents'
  }
} as const;

// Legacy category mapping for backward compatibility
export const categoryColors = {
  // Turkish names
  'Hırsızlık ve Gasp': categoryConfig.theft_robbery,
  'Dolandırıcılık': categoryConfig.fraud_scam,
  'Şiddet': categoryConfig.violence,
  'Cinsel Suçlar': categoryConfig.sexual_crimes,
  'Trafik Olayları': categoryConfig.traffic_incidents,
  'Uyuşturucu Suçları': categoryConfig.drug_crimes,
  'Aile İçi Şiddet': categoryConfig.domestic_violence,
  'Yangın ve Patlama': categoryConfig.fire_explosion,
  'İntihar ve Kayıp': categoryConfig.suicide_missing,
  'Terör ve Güvenlik': categoryConfig.terror_security,
  'Doğal Afet': categoryConfig.natural_disaster,
  'Diğer Olaylar': categoryConfig.other_incidents,
  // English names
  'Theft & Robbery': categoryConfig.theft_robbery,
  'Fraud & Scam': categoryConfig.fraud_scam,
  'Violence': categoryConfig.violence,
  'Sexual Crimes': categoryConfig.sexual_crimes,
  'Traffic Incidents': categoryConfig.traffic_incidents,
  'Drug Crimes': categoryConfig.drug_crimes,
  'Domestic Violence': categoryConfig.domestic_violence,
  'Fire & Explosion': categoryConfig.fire_explosion,
  'Suicide & Missing': categoryConfig.suicide_missing,
  'Terror & Security': categoryConfig.terror_security,
  'Natural Disaster': categoryConfig.natural_disaster,
  'Other Incidents': categoryConfig.other_incidents
} as const;

// Helper functions for key-based category system
export const getCategoryByKey = (key: string) => {
  return categoryConfig[key as keyof typeof categoryConfig] || categoryConfig.other_incidents;
};

export const getCategoryKeyByName = (name: string): string => {
  // First try direct lookup in categoryColors for backward compatibility
  const directMatch = Object.entries(categoryColors).find(([catName]) => catName === name);
  if (directMatch) {
    // Find the key by comparing the config object
    const configEntry = Object.entries(categoryConfig).find(([, config]) => 
      config === directMatch[1]
    );
    if (configEntry) {
      return configEntry[0];
    }
  }
  
  // Fallback to searching by name in both languages
  const keyEntry = Object.entries(categoryConfig).find(([, config]) => 
    config.tr === name || config.en === name
  );
  
  return keyEntry ? keyEntry[0] : 'other_incidents';
};

export const getCategoryName = (key: string, locale: 'tr' | 'en' = 'tr') => {
  const category = getCategoryByKey(key);
  return category[locale];
};

export const getCategoryIcon = (key: string) => {
  const category = getCategoryByKey(key);
  return category.icon;
};

// Legacy function for backward compatibility
export const getCategoryColor = (category: string) => {
  return categoryColors[category as keyof typeof categoryColors] || {
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
    pin: '#6B7280',
    hex: '#6B7280'
  };
};

// New function that uses keys
export const getCategoryColorByKey = (key: string) => {
  const category = getCategoryByKey(key);
  return {
    badge: category.badge,
    pin: category.pin,
    hex: category.hex
  };
};

// Category keys for translation-based categories
export const categoryKeys = [
  'all', // Special key for "All" filter
  'theft_robbery',
  'fraud_scam',
  'violence',
  'sexual_crimes',
  'traffic_incidents',
  'drug_crimes',
  'domestic_violence',
  'fire_explosion',
  'suicide_missing',
  'terror_security',
  'natural_disaster',
  'other_incidents'
] as const;

// Legacy categories array for backward compatibility
export const categories = [
  'Tümü',
  'Hırsızlık ve Gasp',
  'Dolandırıcılık',
  'Şiddet',
  'Cinsel Suçlar',
  'Trafik Olayları',
  'Uyuşturucu Suçları',
  'Aile İçi Şiddet',
  'Yangın ve Patlama',
  'İntihar ve Kayıp',
  'Terör ve Güvenlik',
  'Doğal Afet',
  'Diğer Olaylar'
] as const;