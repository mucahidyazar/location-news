import {ColorPalette} from './themes'

export interface CategoryConfig {
  badge: {
    background: string
    text: string
    border: string
  }
  pin: string
  hex: string
  icon: string
  tr: string
  en: string
}

export function getThemeCategoryConfig(palette: ColorPalette): Record<string, CategoryConfig> {
  return {
    theft_robbery: {
      badge: {
        background: palette.state.error + '20', // error color with 20% opacity
        text: palette.state.error,
        border: palette.state.error + '40'
      },
      pin: palette.state.error,
      hex: palette.state.error,
      icon: 'mask',
      tr: 'Hırsızlık ve Gasp',
      en: 'Theft & Robbery'
    },
    fraud_scam: {
      badge: {
        background: palette.state.warning + '20',
        text: palette.state.warning,
        border: palette.state.warning + '40'
      },
      pin: palette.state.warning,
      hex: palette.state.warning,
      icon: 'credit-card',
      tr: 'Dolandırıcılık',
      en: 'Fraud & Scam'
    },
    violence: {
      badge: {
        background: palette.primary[100],
        text: palette.primary[900],
        border: palette.primary[300]
      },
      pin: palette.primary[600],
      hex: palette.primary[600],
      icon: 'angry-man',
      tr: 'Şiddet',
      en: 'Violence'
    },
    sexual_crimes: {
      badge: {
        background: palette.primary[200],
        text: palette.primary[900],
        border: palette.primary[400]
      },
      pin: palette.primary[700],
      hex: palette.primary[700],
      icon: 'shield-star',
      tr: 'Cinsel Suçlar',
      en: 'Sexual Crimes'
    },
    traffic_incidents: {
      badge: {
        background: palette.state.info + '20',
        text: palette.state.info,
        border: palette.state.info + '40'
      },
      pin: palette.state.info,
      hex: palette.state.info,
      icon: 'car-crash',
      tr: 'Trafik Olayları',
      en: 'Traffic Incidents'
    },
    drug_crimes: {
      badge: {
        background: palette.secondary[100],
        text: palette.secondary[900],
        border: palette.secondary[300]
      },
      pin: palette.secondary[600],
      hex: palette.secondary[600],
      icon: 'drug',
      tr: 'Uyuşturucu Suçları',
      en: 'Drug Crimes'
    },
    domestic_violence: {
      badge: {
        background: palette.primary[50],
        text: palette.primary[800],
        border: palette.primary[200]
      },
      pin: palette.primary[500],
      hex: palette.primary[500],
      icon: 'house-damage',
      tr: 'Aile İçi Şiddet',
      en: 'Domestic Violence'
    },
    fire_explosion: {
      badge: {
        background: palette.state.error + '30',
        text: palette.state.error,
        border: palette.state.error + '50'
      },
      pin: palette.state.error,
      hex: palette.state.error,
      icon: 'fire',
      tr: 'Yangın ve Patlama',
      en: 'Fire & Explosion'
    },
    suicide_missing: {
      badge: {
        background: palette.secondary[200],
        text: palette.secondary[900],
        border: palette.secondary[400]
      },
      pin: palette.secondary[700],
      hex: palette.secondary[700],
      icon: 'missing-person',
      tr: 'İntihar ve Kayıp',
      en: 'Suicide & Missing'
    },
    terror_security: {
      badge: {
        background: palette.primary[300],
        text: palette.primary[950],
        border: palette.primary[500]
      },
      pin: palette.primary[800],
      hex: palette.primary[800],
      icon: 'alert',
      tr: 'Terör ve Güvenlik',
      en: 'Terror & Security'
    },
    natural_disaster: {
      badge: {
        background: palette.state.success + '20',
        text: palette.state.success,
        border: palette.state.success + '40'
      },
      pin: palette.state.success,
      hex: palette.state.success,
      icon: 'storm',
      tr: 'Doğal Afet',
      en: 'Natural Disaster'
    },
    other_incidents: {
      badge: {
        background: palette.text.tertiary + '20',
        text: palette.text.primary,
        border: palette.text.tertiary + '40'
      },
      pin: palette.text.secondary,
      hex: palette.text.secondary,
      icon: 'newspaper-sharp',
      tr: 'Diğer Olaylar',
      en: 'Other Incidents'
    }
  }
}

export function getThemeCategoryColors(palette: ColorPalette): Record<string, CategoryConfig> {
  const config = getThemeCategoryConfig(palette)
  
  return {
    // Turkish names
    'Hırsızlık ve Gasp': config.theft_robbery,
    'Dolandırıcılık': config.fraud_scam,
    'Şiddet': config.violence,
    'Cinsel Suçlar': config.sexual_crimes,
    'Trafik Olayları': config.traffic_incidents,
    'Uyuşturucu Suçları': config.drug_crimes,
    'Aile İçi Şiddet': config.domestic_violence,
    'Yangın ve Patlama': config.fire_explosion,
    'İntihar ve Kayıp': config.suicide_missing,
    'Terör ve Güvenlik': config.terror_security,
    'Doğal Afet': config.natural_disaster,
    'Diğer Olaylar': config.other_incidents,
    // English names
    'Theft & Robbery': config.theft_robbery,
    'Fraud & Scam': config.fraud_scam,
    'Violence': config.violence,
    'Sexual Crimes': config.sexual_crimes,
    'Traffic Incidents': config.traffic_incidents,
    'Drug Crimes': config.drug_crimes,
    'Domestic Violence': config.domestic_violence,
    'Fire & Explosion': config.fire_explosion,
    'Suicide & Missing': config.suicide_missing,
    'Terror & Security': config.terror_security,
    'Natural Disaster': config.natural_disaster,
    'Other Incidents': config.other_incidents
  }
}

export function getCategoryColorByKey(key: string, palette: ColorPalette): CategoryConfig | null {
  const config = getThemeCategoryConfig(palette)
  return config[key] || null
}

export function getCategoryStyleByName(categoryName: string, palette: ColorPalette): CategoryConfig | null {
  const colors = getThemeCategoryColors(palette)
  return colors[categoryName] || null
}