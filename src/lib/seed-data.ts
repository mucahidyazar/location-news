import { insertNews, insertLocation, updateLocationNewsCount } from './database';

const sampleNews = [
  {
    title: "İstanbul'da Yeni Metro Hattı Açıldı",
    content: "İstanbul Büyükşehir Belediyesi tarafından yapımı tamamlanan yeni metro hattı hizmete girdi. Hat, günde yaklaşık 100 bin yolcuya hizmet verecek.",
    location: "İstanbul - Kadıköy",
    latitude: 40.9779,
    longitude: 29.0310,
    category: "Ulaştırma",
    publishedAt: "2024-01-15T10:00:00Z",
    source: "Reuters",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400"
  },
  {
    title: "Ankara'da Teknoloji Zirvesi Başladı",
    content: "Türkiye'nin en büyük teknoloji etkinliği olan TechSummit Ankara'da kapılarını açtı. 3 gün sürecek etkinlikte yapay zeka ve blockchain konuları ele alınacak.",
    location: "Ankara - Çankaya",
    latitude: 39.9180,
    longitude: 32.8540,
    category: "Teknoloji",
    publishedAt: "2024-01-14T09:30:00Z",
    source: "Reuters",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400"
  },
  {
    title: "İzmir'de Kültür Festivali Düzenleniyor",
    content: "İzmir Büyükşehir Belediyesi'nin organize ettiği kültür festivali başladı. Festival kapsamında müze gezileri, konserler ve sergiler düzenlenecek.",
    location: "İzmir - Alsancak",
    latitude: 38.4370,
    longitude: 27.1430,
    category: "Kültür",
    publishedAt: "2024-01-13T14:15:00Z",
    source: "Reuters",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Bursa'da Yeni Hastane Açılışı",
    content: "Bursa'nın Nilüfer ilçesinde yapımı tamamlanan 500 yataklı hastane törenle hizmete açıldı. Hastane, bölgedeki sağlık hizmetlerini güçlendirecek.",
    location: "Bursa - Nilüfer",
    latitude: 40.2270,
    longitude: 28.9870,
    category: "Sağlık",
    publishedAt: "2024-01-12T11:00:00Z",
    source: "Reuters",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
  },
  {
    title: "Antalya'da Turizm Rekoru",
    content: "Antalya'ya gelen turist sayısı bu yıl rekor kırdı. Özellikle kış turizmi alanında ciddi artış yaşandığı belirtildi.",
    location: "Antalya - Kaleiçi",
    latitude: 36.8840,
    longitude: 30.7020,
    category: "Turizm",
    publishedAt: "2024-01-11T16:20:00Z",
    source: "Reuters",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fef?w=400"
  },
  {
    title: "Konya'da Tarım Fuarı",
    content: "Konya'da düzenlenen uluslararası tarım fuarı, çiftçiler ve tarım makineleri üreticilerini bir araya getirdi.",
    location: "Konya - Selçuklu",
    latitude: 37.8630,
    longitude: 32.5180,
    category: "Tarım",
    publishedAt: "2024-01-10T13:45:00Z",
    source: "AP News",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Adana'da Spor Kompleksi Açıldı",
    content: "Adana Büyükşehir Belediyesi tarafından yapılan modern spor kompleksi hizmete girdi. Kompleks, olimpik standartlarda havuz ve spor salonları içeriyor.",
    location: "Adana - Seyhan",
    latitude: 37.0150,
    longitude: 35.3420,
    category: "Spor",
    publishedAt: "2024-01-09T08:30:00Z",
    source: "AP News",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
  },
  {
    title: "Trabzon'da Çevre Projesi",
    content: "Trabzon'da deniz kirliliğini önlemek için başlatılan çevre projesi kapsamında yeni arıtma tesisleri kurulacak.",
    location: "Trabzon - Ortahisar",
    latitude: 41.0120,
    longitude: 39.7250,
    category: "Çevre",
    publishedAt: "2024-01-08T12:00:00Z",
    source: "AP News",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=400"
  },
  {
    title: "İstanbul Beşiktaş'ta Sanat Sergisi",
    content: "Beşiktaş Belediyesi'nin düzenlediği çağdaş sanat sergisi sanatseverlerle buluştu.",
    location: "İstanbul - Beşiktaş",
    latitude: 41.0422,
    longitude: 29.0100,
    category: "Kültür",
    publishedAt: "2024-01-07T15:30:00Z",
    source: "BBC News",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400"
  },
  {
    title: "Üsküdar'da Sağlık Taraması",
    content: "Üsküdar ilçesinde ücretsiz sağlık taraması kampanyası başlatıldı.",
    location: "İstanbul - Üsküdar",
    latitude: 41.0214,
    longitude: 29.0665,
    category: "Sağlık",
    publishedAt: "2024-01-06T11:00:00Z",
    source: "BBC News",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
  },
  {
    title: "Ankara Kızılay'da Teknoloji Fuarı",
    content: "Kızılay merkezde düzenlenen teknoloji fuarı büyük ilgi gördü.",
    location: "Ankara - Kızılay",
    latitude: 39.9208,
    longitude: 32.8541,
    category: "Teknoloji",
    publishedAt: "2024-01-05T14:20:00Z",
    source: "BBC News",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400"
  },
  {
    title: "İzmir Konak'ta Çevre Etkinliği",
    content: "Konak Belediyesi çevre bilincini artırmak için etkinlik düzenledi.",
    location: "İzmir - Konak",
    latitude: 38.4189,
    longitude: 27.1287,
    category: "Çevre",
    publishedAt: "2024-01-04T09:45:00Z",
    source: "CNN",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=400"
  },
  {
    title: "Gaziantep'te Gastronomi Festivali",
    content: "Gaziantep'te düzenlenen gastronomi festivali yerli ve yabancı turistlerin büyük ilgisini çekti.",
    location: "Gaziantep - Şehitkamil",
    latitude: 37.0662,
    longitude: 37.3833,
    category: "Turizm",
    publishedAt: "2024-01-03T16:30:00Z",
    source: "CNN",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Kayseri'de Sanayi Yatırımı",
    content: "Kayseri'ye yapılan yeni sanayi yatırımı ile 2000 kişiye istihdam sağlanacak.",
    location: "Kayseri - Melikgazi",
    latitude: 38.7196,
    longitude: 35.4815,
    category: "Ekonomi",
    publishedAt: "2024-01-02T13:15:00Z",
    source: "CNN",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Eskişehir'de Üniversite İşbirliği",
    content: "Eskişehir'deki üniversiteler arasında yeni işbirliği protokolü imzalandı.",
    location: "Eskişehir - Odunpazarı",
    latitude: 39.7667,
    longitude: 30.5256,
    category: "Eğitim",
    publishedAt: "2024-01-01T11:00:00Z",
    source: "TRT Haber",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400"
  },
  {
    title: "Samsun'da Balık Üretimi Artışı",
    content: "Samsun'da su ürünleri üretimi geçen yıla göre %30 arttı.",
    location: "Samsun - İlkadım",
    latitude: 41.2928,
    longitude: 36.3313,
    category: "Tarım",
    publishedAt: "2023-12-31T14:45:00Z",
    source: "TRT Haber",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Denizli'de Tekstil Fuarı",
    content: "Denizli'de düzenlenen uluslararası tekstil fuarı büyük ilgi gördü.",
    location: "Denizli - Pamukkale",
    latitude: 37.7348,
    longitude: 29.0875,
    category: "Ekonomi",
    publishedAt: "2023-12-30T09:20:00Z",
    source: "TRT Haber",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Malatya'da Kayısı Hasadı",
    content: "Malatya'da bu yıl kayısı hasadı beklenenin üzerinde gerçekleşti.",
    location: "Malatya - Battalgazi",
    latitude: 38.3552,
    longitude: 38.2675,
    category: "Tarım",
    publishedAt: "2023-12-29T16:10:00Z",
    source: "France24",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Van'da Kış Turizmi",
    content: "Van Gölü çevresinde kış turizmi faaliyetleri başladı.",
    location: "Van - İpekyolu",
    latitude: 38.4891,
    longitude: 43.4089,
    category: "Turizm",
    publishedAt: "2023-12-28T12:35:00Z",
    source: "France24",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fef?w=400"
  },
  {
    title: "Erzurum'da Kış Sporları Merkezi",
    content: "Erzurum'da yeni kış sporları merkezi hizmete açıldı.",
    location: "Erzurum - Yakutiye",
    latitude: 39.9043,
    longitude: 41.2678,
    category: "Spor",
    publishedAt: "2023-12-27T10:25:00Z",
    source: "France24",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
  },
  {
    title: "Diyarbakır'da Tarihi Restorasyon",
    content: "Diyarbakır'da sur içindeki tarihi yapıların restorasyonu tamamlandı.",
    location: "Diyarbakır - Sur",
    latitude: 37.9144,
    longitude: 40.2306,
    category: "Kültür",
    publishedAt: "2023-12-26T15:50:00Z",
    source: "Deutsche Welle",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Mersin'de Liman Yatırımı",
    content: "Mersin Limanı'na yapılan yatırım ile kapasite iki katına çıkarıldı.",
    location: "Mersin - Akdeniz",
    latitude: 36.8121,
    longitude: 34.6415,
    category: "Ekonomi",
    publishedAt: "2023-12-25T08:15:00Z",
    source: "Deutsche Welle",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Şanlıurfa'da Arkeolojik Keşif",
    content: "Şanlıurfa'da yapılan kazılarda 8000 yıllık tarihi eserler bulundu.",
    location: "Şanlıurfa - Haliliye",
    latitude: 37.1591,
    longitude: 38.7969,
    category: "Kültür",
    publishedAt: "2023-12-24T13:40:00Z",
    source: "Deutsche Welle",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Hatay'da Zeytin Hasadı",
    content: "Hatay'da zeytin hasadı sezonunda kaliteli ürün elde edildi.",
    location: "Hatay - Antakya",
    latitude: 36.2081,
    longitude: 36.1610,
    category: "Tarım",
    publishedAt: "2023-12-23T11:20:00Z",
    source: "Al Jazeera",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Muğla'da Doğa Koruma Projesi",
    content: "Muğla'da başlatılan doğa koruma projesi kapsamında yeni orman alanları oluşturulacak.",
    location: "Muğla - Menteşe",
    latitude: 37.2153,
    longitude: 28.3636,
    category: "Çevre",
    publishedAt: "2023-12-22T14:55:00Z",
    source: "Al Jazeera",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=400"
  },
  {
    title: "Rize'de Çay Üretimi",
    content: "Rize'de bu yıl çay üretimi rekor seviyeye ulaştı.",
    location: "Rize - Merkez",
    latitude: 41.0201,
    longitude: 40.5234,
    category: "Tarım",
    publishedAt: "2023-12-21T09:30:00Z",
    source: "Al Jazeera",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Aydın'da Jeotermal Enerji",
    content: "Aydın'da yeni jeotermal enerji santrali üretime başladı.",
    location: "Aydın - Efeler",
    latitude: 37.8560,
    longitude: 27.8416,
    category: "Enerji",
    publishedAt: "2023-12-20T16:45:00Z",
    source: "Sky News",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400"
  },
  {
    title: "Çanakkale'de Tarihi Etkinlik",
    content: "Çanakkale'de Gelibolu Yarımadası'nda anma törenleri düzenlendi.",
    location: "Çanakkale - Merkez",
    latitude: 40.1553,
    longitude: 26.4142,
    category: "Kültür",
    publishedAt: "2023-12-19T12:10:00Z",
    source: "Sky News",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Balıkesir'de Tarım Teknolojisi",
    content: "Balıkesir'de akıllı tarım teknolojileri kullanımı yaygınlaştırılıyor.",
    location: "Balıkesir - Karesi",
    latitude: 39.6484,
    longitude: 27.8826,
    category: "Teknoloji",
    publishedAt: "2023-12-18T10:55:00Z",
    source: "Sky News",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400"
  },
  {
    title: "Kırıkkale'de Sanayi Üretimi",
    content: "Kırıkkale'de sanayi üretimi bu yıl %15 artış gösterdi.",
    location: "Kırıkkale - Merkez",
    latitude: 39.8468,
    longitude: 33.5153,
    category: "Ekonomi",
    publishedAt: "2023-12-17T14:25:00Z",
    source: "Euronews",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Afyonkarahisar'da Termal Turizm",
    content: "Afyonkarahisar'da termal turizm tesisleri yenilendi.",
    location: "Afyonkarahisar - Merkez",
    latitude: 38.7507,
    longitude: 30.5567,
    category: "Turizm",
    publishedAt: "2023-12-16T11:35:00Z",
    source: "Euronews",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fef?w=400"
  },
  {
    title: "Isparta'da Gül Festivali",
    content: "Isparta'da geleneksel gül festivali büyük katılımla gerçekleştirildi.",
    location: "Isparta - Merkez",
    latitude: 37.7648,
    longitude: 30.5566,
    category: "Kültür",
    publishedAt: "2023-12-15T13:20:00Z",
    source: "Euronews",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Manisa'da Üzüm Hasadı",
    content: "Manisa'da üzüm hasadı sezonunda kaliteli mahsul elde edildi.",
    location: "Manisa - Yunusemre",
    latitude: 38.6191,
    longitude: 27.4289,
    category: "Tarım",
    publishedAt: "2023-12-14T15:45:00Z",
    source: "Associated Press",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Uşak'ta Tekstil İhracatı",
    content: "Uşak'tan yapılan tekstil ihracatı geçen yıla göre %25 arttı.",
    location: "Uşak - Merkez",
    latitude: 38.6823,
    longitude: 29.4082,
    category: "Ekonomi",
    publishedAt: "2023-12-13T09:15:00Z",
    source: "Associated Press",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Zonguldak'ta Kömür Üretimi",
    content: "Zonguldak'ta kömür üretiminde yeni teknolojiler kullanılmaya başlandı.",
    location: "Zonguldak - Merkez",
    latitude: 41.4564,
    longitude: 31.7987,
    category: "Enerji",
    publishedAt: "2023-12-12T12:30:00Z",
    source: "Associated Press",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400"
  },
  {
    title: "Sakarya'da Otomotiv Yatırımı",
    content: "Sakarya'da otomotiv sektöründe yeni yatırım projeleri hayata geçiriliyor.",
    location: "Sakarya - Adapazarı",
    latitude: 40.7833,
    longitude: 30.4167,
    category: "Ekonomi",
    publishedAt: "2023-12-11T16:20:00Z",
    source: "Bloomberg",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Düzce'de Orman Koruma",
    content: "Düzce'de orman koruma projeleri kapsamında yeni fidanlık alanları oluşturuldu.",
    location: "Düzce - Merkez",
    latitude: 40.8438,
    longitude: 31.1565,
    category: "Çevre",
    publishedAt: "2023-12-10T10:40:00Z",
    source: "Bloomberg",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=400"
  },
  {
    title: "Bolu'da Turizm Yatırımları",
    content: "Bolu'da doğa turizmi alanında yeni projeler geliştirilmekte.",
    location: "Bolu - Merkez",
    latitude: 40.7394,
    longitude: 31.6061,
    category: "Turizm",
    publishedAt: "2023-12-09T14:55:00Z",
    source: "Bloomberg",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fef?w=400"
  },
  {
    title: "Çorum'da Tarih Müzesi",
    content: "Çorum'da yeni arkeoloji müzesi ziyaretçilere açıldı.",
    location: "Çorum - Merkez",
    latitude: 40.5506,
    longitude: 34.9556,
    category: "Kültür",
    publishedAt: "2023-12-08T11:25:00Z",
    source: "Financial Times",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Tokat'ta Organik Tarım",
    content: "Tokat'ta organik tarım alanında ciddi gelişmeler kaydedildi.",
    location: "Tokat - Merkez",
    latitude: 40.3167,
    longitude: 36.5500,
    category: "Tarım",
    publishedAt: "2023-12-07T13:50:00Z",
    source: "Financial Times",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Amasya'da Elma Üretimi",
    content: "Amasya'da elma üretimi ve kalitesi bu yıl rekor seviyeye çıktı.",
    location: "Amasya - Merkez",
    latitude: 40.6499,
    longitude: 35.8353,
    category: "Tarım",
    publishedAt: "2023-12-06T15:15:00Z",
    source: "Financial Times",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Sivas'ta Gıda Sanayi",
    content: "Sivas'ta gıda sanayii alanında yeni tesisler kuruldu.",
    location: "Sivas - Merkez",
    latitude: 39.7477,
    longitude: 37.0179,
    category: "Ekonomi",
    publishedAt: "2023-12-05T08:40:00Z",
    source: "Wall Street Journal",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Yozgat'ta Hayvancılık",
    content: "Yozgat'ta modern hayvancılık tesisleri devreye girdi.",
    location: "Yozgat - Merkez",
    latitude: 39.8181,
    longitude: 34.8147,
    category: "Tarım",
    publishedAt: "2023-12-04T12:05:00Z",
    source: "Wall Street Journal",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Kırşehir'de Enerji Projesi",
    content: "Kırşehir'de yenilenebilir enerji projesi hayata geçirildi.",
    location: "Kırşehir - Merkez",
    latitude: 39.1425,
    longitude: 34.1709,
    category: "Enerji",
    publishedAt: "2023-12-03T14:30:00Z",
    source: "Wall Street Journal",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400"
  },
  {
    title: "Nevşehir'de Balon Turizmi",
    content: "Nevşehir'de sıcak hava balonu turizmi yeni rekorlar kırıyor.",
    location: "Nevşehir - Merkez",
    latitude: 38.6939,
    longitude: 34.6857,
    category: "Turizm",
    publishedAt: "2023-12-02T16:45:00Z",
    source: "Guardian",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fef?w=400"
  },
  {
    title: "Kilis'te Gastronomi",
    content: "Kilis'in geleneksel mutfağı UNESCO listesine aday gösterildi.",
    location: "Kilis - Merkez",
    latitude: 36.7184,
    longitude: 37.1212,
    category: "Kültür",
    publishedAt: "2023-12-01T10:20:00Z",
    source: "Guardian",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Osmaniye'de Tarımsal Araştırma",
    content: "Osmaniye'de yeni tarımsal araştırma merkezi kuruldu.",
    location: "Osmaniye - Merkez",
    latitude: 37.0742,
    longitude: 36.2461,
    category: "Tarım",
    publishedAt: "2023-11-30T13:35:00Z",
    source: "Guardian",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Batman'da Petrol Keşfi",
    content: "Batman'da yeni petrol rezervleri keşfedildi.",
    location: "Batman - Merkez",
    latitude: 37.8812,
    longitude: 41.1351,
    category: "Enerji",
    publishedAt: "2023-11-29T11:50:00Z",
    source: "NTV",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400"
  },
  {
    title: "Şırnak'ta Sınır Güvenliği",
    content: "Şırnak'ta sınır güvenliği için yeni teknolojiler devreye alındı.",
    location: "Şırnak - Merkez",
    latitude: 37.4187,
    longitude: 42.4918,
    category: "Güvenlik",
    publishedAt: "2023-11-28T15:25:00Z",
    source: "NTV",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400"
  },
  {
    title: "Mardin'de Kültür Turizmi",
    content: "Mardin'de tarihi yapıların restorasyonu tamamlandı ve turizme açıldı.",
    location: "Mardin - Artuklu",
    latitude: 37.3212,
    longitude: 40.7245,
    category: "Turizm",
    publishedAt: "2023-11-27T09:10:00Z",
    source: "NTV",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fef?w=400"
  },
  {
    title: "İstanbul'da Uyuşturucu Operasyonu",
    content: "İstanbul Emniyet Müdürlüğü tarafından düzenlenen operasyonda 15 şüpheli gözaltına alındı.",
    location: "İstanbul - Fatih",
    latitude: 41.0082,
    longitude: 28.9784,
    category: "Suç",
    publishedAt: "2023-11-26T14:30:00Z",
    source: "CNN",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400"
  },
  {
    title: "Ankara'da Siber Suç Operasyonu",
    content: "Ankara'da siber suçlarla mücadele kapsamında 8 kişi yakalandı.",
    location: "Ankara - Çankaya",
    latitude: 39.9180,
    longitude: 32.8540,
    category: "Suç",
    publishedAt: "2023-11-25T16:45:00Z",
    source: "TRT Haber",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400"
  },
  {
    title: "Ukrayna'da Savaş Devam Ediyor",
    content: "Ukrayna'nın doğu bölgelerinde çatışmalar şiddetlenerek devam ediyor.",
    location: "Kiev - Merkez",
    latitude: 50.4501,
    longitude: 30.5234,
    category: "Savaş",
    publishedAt: "2023-11-24T12:20:00Z",
    source: "BBC News",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
  },
  {
    title: "Gazze'de Savaş Sürüyor",
    content: "Gazze Şeridi'nde devam eden çatışmalarda siviller zarar görmeye devam ediyor.",
    location: "Gazze - Merkez",
    latitude: 31.5017,
    longitude: 34.4668,
    category: "Savaş",
    publishedAt: "2023-11-23T09:15:00Z",
    source: "Al Jazeera",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
  },
  {
    title: "İstanbul'da Oyun Festivali",
    content: "İstanbul'da düzenlenen oyun festivali binlerce oyuncuyu bir araya getirdi.",
    location: "İstanbul - Beşiktaş",
    latitude: 41.0422,
    longitude: 29.0100,
    category: "Oyunlar",
    publishedAt: "2023-11-22T18:30:00Z",
    source: "Reuters",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Ankara'da E-Spor Turnuvası",
    content: "Ankara'da düzenlenen uluslararası e-spor turnuvası büyük ilgi gördü.",
    location: "Ankara - Kızılay",
    latitude: 39.9208,
    longitude: 32.8541,
    category: "Oyunlar",
    publishedAt: "2023-11-21T15:45:00Z",
    source: "Sky News",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "İzmir'de Oyun Geliştirme Merkezi",
    content: "İzmir'de oyun geliştirme merkezi açıldı ve yerli oyun yapımcılarını destekleyecek.",
    location: "İzmir - Alsancak",
    latitude: 38.4370,
    longitude: 27.1430,
    category: "Oyunlar",
    publishedAt: "2023-11-20T11:00:00Z",
    source: "Euronews",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Bursa'da Otomotiv İhracatı",
    content: "Bursa'dan yapılan otomotiv ihracatı geçen yıla göre %40 arttı.",
    location: "Bursa - Osmangazi",
    latitude: 40.1956,
    longitude: 29.0610,
    category: "Ekonomi",
    publishedAt: "2023-11-19T14:20:00Z",
    source: "Habertürk",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Antalya'da Film Festivali",
    content: "Antalya Altın Portakal Film Festivali büyük katılımla başladı.",
    location: "Antalya - Kaleiçi",
    latitude: 36.8840,
    longitude: 30.7020,
    category: "Kültür",
    publishedAt: "2023-11-18T16:45:00Z",
    source: "Habertürk",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    title: "Konya'da Güneş Enerji Santrali",
    content: "Konya'da kurulan güneş enerji santrali üretime başladı.",
    location: "Konya - Selçuklu",
    latitude: 37.8630,
    longitude: 32.5180,
    category: "Enerji",
    publishedAt: "2023-11-17T10:30:00Z",
    source: "Milliyet",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400"
  },
  {
    title: "Trabzon'da Balık İhracatı",
    content: "Trabzon'dan yapılan balık ihracatı bu yıl rekor kırdı.",
    location: "Trabzon - Ortahisar",
    latitude: 41.0120,
    longitude: 39.7250,
    category: "Ekonomi",
    publishedAt: "2023-11-16T13:15:00Z",
    source: "Milliyet",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "İstanbul'da Teknoloji Startupları",
    content: "İstanbul'da teknoloji startuplarına destek programı başlatıldı.",
    location: "İstanbul - Beşiktaş",
    latitude: 41.0422,
    longitude: 29.0100,
    category: "Teknoloji",
    publishedAt: "2023-11-15T11:50:00Z",
    source: "Sabah",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400"
  },
  {
    title: "Ankara'da Bilim Merkezi",
    content: "Ankara'da yeni bilim merkezi çocuklarla buluştu.",
    location: "Ankara - Çankaya",
    latitude: 39.9180,
    longitude: 32.8540,
    category: "Eğitim",
    publishedAt: "2023-11-14T15:25:00Z",
    source: "Sabah",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400"
  },
  {
    title: "İzmir'de Deniz Ulaşımı",
    content: "İzmir'de deniz ulaşımında yeni hat devreye girdi.",
    location: "İzmir - Konak",
    latitude: 38.4189,
    longitude: 27.1287,
    category: "Ulaştırma",
    publishedAt: "2023-11-13T09:40:00Z",
    source: "Cumhuriyet",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400"
  },
  {
    title: "Adana'da Tarım Teknolojisi",
    content: "Adana'da tarım teknolojileri fuarı düzenlendi.",
    location: "Adana - Seyhan",
    latitude: 37.0150,
    longitude: 35.3420,
    category: "Tarım",
    publishedAt: "2023-11-12T12:10:00Z",
    source: "Cumhuriyet",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    title: "Gaziantep'te Sanayi Üretimi",
    content: "Gaziantep'te sanayi üretimi yeni rekor kırdı.",
    location: "Gaziantep - Şehitkamil",
    latitude: 37.0662,
    longitude: 37.3833,
    category: "Ekonomi",
    publishedAt: "2023-11-11T14:30:00Z",
    source: "Hürriyet Daily News",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    title: "Kayseri'de Havacılık Sanayi",
    content: "Kayseri'de havacılık sanayi yatırımları artıyor.",
    location: "Kayseri - Melikgazi",
    latitude: 38.7196,
    longitude: 35.4815,
    category: "Teknoloji",
    publishedAt: "2023-11-10T16:55:00Z",
    source: "Hürriyet Daily News",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400"
  }
];

const locations = [
  { name: "İstanbul - Kadıköy", latitude: 40.9779, longitude: 29.0310, newsCount: 0 },
  { name: "İstanbul - Beşiktaş", latitude: 41.0422, longitude: 29.0100, newsCount: 0 },
  { name: "İstanbul - Üsküdar", latitude: 41.0214, longitude: 29.0665, newsCount: 0 },
  { name: "İstanbul - Fatih", latitude: 41.0082, longitude: 28.9784, newsCount: 0 },
  { name: "Ankara - Çankaya", latitude: 39.9180, longitude: 32.8540, newsCount: 0 },
  { name: "Ankara - Kızılay", latitude: 39.9208, longitude: 32.8541, newsCount: 0 },
  { name: "İzmir - Alsancak", latitude: 38.4370, longitude: 27.1430, newsCount: 0 },
  { name: "İzmir - Konak", latitude: 38.4189, longitude: 27.1287, newsCount: 0 },
  { name: "Bursa - Nilüfer", latitude: 40.2270, longitude: 28.9870, newsCount: 0 },
  { name: "Bursa - Osmangazi", latitude: 40.1956, longitude: 29.0610, newsCount: 0 },
  { name: "Antalya - Kaleiçi", latitude: 36.8840, longitude: 30.7020, newsCount: 0 },
  { name: "Antalya - Lara", latitude: 36.8580, longitude: 30.7780, newsCount: 0 },
  { name: "Konya - Selçuklu", latitude: 37.8630, longitude: 32.5180, newsCount: 0 },
  { name: "Konya - Meram", latitude: 37.8520, longitude: 32.4650, newsCount: 0 },
  { name: "Adana - Seyhan", latitude: 37.0150, longitude: 35.3420, newsCount: 0 },
  { name: "Adana - Yüreğir", latitude: 36.9850, longitude: 35.3080, newsCount: 0 },
  { name: "Trabzon - Ortahisar", latitude: 41.0120, longitude: 39.7250, newsCount: 0 },
  { name: "Trabzon - Akçaabat", latitude: 41.0200, longitude: 39.5700, newsCount: 0 },
  { name: "Kiev - Merkez", latitude: 50.4501, longitude: 30.5234, newsCount: 0 },
  { name: "Gazze - Merkez", latitude: 31.5017, longitude: 34.4668, newsCount: 0 }
];

export function seedDatabase() {
  try {
    locations.forEach(location => {
      insertLocation(location);
    });

    sampleNews.forEach(news => {
      insertNews(news);
    });

    locations.forEach(location => {
      updateLocationNewsCount(location.name);
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}