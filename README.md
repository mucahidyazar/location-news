# mappy.news

A news-on-map application that displays location-based news articles on an
interactive map interface with advanced filtering capabilities.

## ✨ Features

- **Interactive Map**: Full-screen Leaflet map showing news markers by location
- **Advanced Filtering**: Filter by categories, sources, date ranges, and search
  terms
- **Multiple View Types**: Card, horizontal, and minimal news layouts
- **Smart Date Picker**: Quick date range selection with presets
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Dynamic news filtering and map updates
- **Buy Me A Coffee Integration**: Support for voluntary journalism

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Database**: SQLite with better-sqlite3
- **Map**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **Date Handling**: date-fns + react-day-picker
- **SEO**: Optimized metadata, sitemap, Open Graph tags
- **PWA**: App icons, manifest, offline capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mappy.news
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

- **Map Navigation**: Pan and zoom on the interactive map to explore different
  locations
- **News Filtering**: Use the floating filter panel to filter by categories,
  sources, and date ranges
- **Search**: Search through news titles and content using the search bar
- **View Types**: Switch between different news card layouts in the sidebar
- **Location Selection**: Click on map markers to filter news by specific
  locations

## 📊 Data Structure

The application uses SQLite database with the following main entities:

- **News Items**: Title, content, location, category, source, publish date
- **Locations**: Geographic coordinates and location names
- **Categories**: Crime, discovery, sports, politics, technology, etc.

## 🎨 UI Components

Built with shadcn/ui components including:

- Interactive maps with Leaflet
- Date pickers and calendars
- Badges and buttons
- Cards and tooltips
- Responsive layouts

## ✨ Additional Features

- **SEO Optimized**: Complete metadata, sitemap.xml, robots.txt
- **PWA Ready**: App icons, manifest.json, offline support
- **Security**: Security headers, CSRF protection
- **Error Handling**: Custom 404/500 pages, graceful error boundaries
- **Performance**: Optimized images, lazy loading, efficient bundling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ☕ Support

If you find this project helpful, consider
[buying me a coffee](https://www.buymeacoffee.com/mucahidyazar)!
