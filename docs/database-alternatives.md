# Data Management Alternatives for mappy.news

Bu dokuman mappy.news projesi için en uygun maliyetli ve kolay data
saklama/girişi alternativlerini sunar.

## 🎯 Değerlendirme Kriterleri

- **Maliyet**: Ücretsiz/düşük maliyetli seçenekler
- **Kolay Kullanım**: Minimum teknik bilgi gereksinimi
- **Hızlı Kurulum**: Dakikalar içinde hazır
- **Veri Girişi**: Admin panel veya kolay arayüz
- **API Desteği**: Next.js ile kolay entegrasyon

## 📊 10 Alternatif Data Yönetim Sistemi

### 1. **Supabase** ⭐⭐⭐⭐⭐

- **Maliyet**: 50,000 satıra kadar ücretsiz
- **Kurulum**: 5 dakika, tek tıkla PostgreSQL
- **Admin Panel**: Dahili tablo editörü, SQL editor
- **Avantajlar**: Real-time, auth sistemi, storage
- **Veri Girişi**: Web arayüzü + CSV import
- **Entegrasyon**: `@supabase/supabase-js` ile kolay

### 2. **Airtable** ⭐⭐⭐⭐⭐

- **Maliyet**: 1,000 kayıta kadar ücretsiz
- **Kurulum**: Anında, Excel benzeri arayüz
- **Admin Panel**: En kolay veri girişi, drag&drop
- **Avantajlar**: Çok kullanıcılı editör, form desteği
- **Veri Girişi**: Spreadsheet + web forms
- **Entegrasyon**: REST API ile kolay

### 3. **Google Sheets + API** ⭐⭐⭐⭐

- **Maliyet**: Tamamen ücretsiz
- **Kurulum**: Google Sheets + API key
- **Admin Panel**: Google Sheets arayüzü
- **Avantajlar**: Herkes bilir, kolay paylaşım
- **Veri Girişi**: Sheets editör + form entegrasyonu
- **Entegrasyon**: Google Sheets API

### 4. **Strapi (Headless CMS)** ⭐⭐⭐⭐

- **Maliyet**: Self-hosted ücretsiz, cloud $9/ay
- **Kurulum**: 15 dakika, one-click deploy
- **Admin Panel**: Güçlü içerik yönetimi
- **Avantajlar**: Professional CMS, çok kullanıcılı
- **Veri Girişi**: Modern admin interface
- **Entegrasyon**: REST/GraphQL API

### 5. **Sanity.io** ⭐⭐⭐⭐

- **Maliyet**: 10,000 dokümana kadar ücretsiz
- **Kurulum**: 10 dakika, hosted çözüm
- **Admin Panel**: Sanity Studio - modern editör
- **Avantajlar**: Real-time, image optimization
- **Veri Girişi**: Studio interface + programmatic
- **Entegrasyon**: `@sanity/client` ile kolay

### 6. **Firebase Firestore** ⭐⭐⭐⭐

- **Maliyet**: 50,000 okuma/gün ücretsiz
- **Kurulum**: 10 dakika, Google console
- **Admin Panel**: Firebase console + custom admin
- **Avantajlar**: Real-time, offline support
- **Veri Girişi**: Console + custom forms
- **Entegrasyon**: Firebase SDK

### 7. **Contentful** ⭐⭐⭐

- **Maliyet**: 25,000 kayıt ücretsiz
- **Kurulum**: 15 dakika, hosted CMS
- **Admin Panel**: Professional content management
- **Avantajlar**: CDN, image processing
- **Veri Girişi**: Web interface + import tools
- **Entegrasyon**: Content Delivery API

### 8. **Notion Database** ⭐⭐⭐

- **Maliyet**: Personal use ücretsiz
- **Kurulum**: Anında, Notion workspace
- **Admin Panel**: Notion page interface
- **Avantajlar**: Çok kolay kullanım, görsel
- **Veri Girişi**: Notion editör + templates
- **Entegrasyon**: Notion API (beta)

### 9. **MongoDB Atlas** ⭐⭐⭐

- **Maliyet**: 512MB ücretsiz cluster
- **Kurulum**: 20 dakika, cloud database
- **Admin Panel**: MongoDB Compass + web interface
- **Avantajlar**: NoSQL esnekliği, indexing
- **Veri Girişi**: Compass GUI + import tools
- **Entegrasyon**: MongoDB driver

### 10. **Hasura + PostgreSQL** ⭐⭐⭐

- **Maliyet**: Hasura Cloud ücretsiz tier
- **Kurulum**: 30 dakika, GraphQL otomatik
- **Admin Panel**: Hasura console + custom admin
- **Avantajlar**: Auto GraphQL API, subscriptions
- **Veri Girişi**: SQL + custom React admin
- **Entegrasyon**: GraphQL client

## 🏆 En İyi 3 Öneri

### 1. **Supabase** (En Dengeli)

```javascript
// Kurulum
npm install @supabase/supabase-js

// Kullanım
const supabase = createClient(url, key)
const { data } = await supabase.from('news').select('*')
```

### 2. **Airtable** (En Kolay Veri Girişi)

```javascript
// Kurulum
npm install airtable

// Kullanım
const base = new Airtable({apiKey}).base(baseId)
const records = await base('News').select().all()
```

### 3. **Google Sheets** (En Ekonomik)

```javascript
// Kurulum
npm install googleapis

// Kullanım
const sheets = google.sheets({version: 'v4', auth})
const response = await sheets.spreadsheets.values.get({...})
```

## 🔄 Mevcut SQLite'dan Geçiş

### Geçiş Süreci

1. **Veri Export**: SQLite'dan CSV/JSON export
2. **Hedef Sistem**: Seçilen platforma import
3. **API Değişiklik**: Route handlers güncelleme
4. **Test**: Data flow doğrulama

### Kod Değişikliği Örneği (Supabase)

```typescript
// Eski: src/lib/database.ts
// Yeni: src/lib/supabase.ts
import {createClient} from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function getNews() {
  const {data, error} = await supabase
    .from('news')
    .select('*')
    .order('published_at', {ascending: false})

  return data || []
}
```

## 💡 Önerilen Aksiyon Planı

1. **Hızlı Test**: Airtable ile 30 dakika test
2. **Üretim**: Supabase ile kurulum (1 saat)
3. **Yedek Plan**: Google Sheets hazır tutma
4. **Veri Girişi**: Airtable/Supabase admin panel

## 📝 Sonuç

**En hızlı ve kolay**: Airtable (5 dakika kurulum)  
**En kapsamlı**: Supabase (profesyonel özellikler)  
**En ekonomik**: Google Sheets (tamamen ücretsiz)

Proje boyutuna göre Airtable → Supabase geçişi önerilir.
