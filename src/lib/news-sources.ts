export const newsSourceLogos: Record<string, string> = {
  'Reuters': '📰',
  'AP News': '🗞️',
  'BBC News': '📺',
  'CNN': '📡',
  'TRT Haber': '📻',
  'France24': '🇫🇷',
  'Deutsche Welle': '🇩🇪',
  'Al Jazeera': '🌍',
  'Sky News': '🛰️',
  'Euronews': '🇪🇺',
  'Associated Press': '📃',
  'Bloomberg': '💼',
  'Financial Times': '💰',
  'Wall Street Journal': '💵',
  'Guardian': '🇬🇧',
  'NTV': '📺',
  'IHA': '📰',
  'AA': '🇹🇷',
  'Anadolu Ajansı': '🇹🇷',
  'Hürriyet': '📰',
  'Habertürk': '📺',
  'Milliyet': '🗞️',
  'Sabah': '📰',
  'Cumhuriyet': '📃',
  'Hürriyet Daily News': '🌐'
};

export function getSourceLogo(source: string): string {
  return newsSourceLogos[source] || '📰';
}