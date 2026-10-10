# KESKİN

Radar uydu görüntülerinde süper çözünürlük ve nesne tespiti araştırması için proje sitesi.

Site yayınlanmaya hazır HTML, CSS ve JavaScript dosyalarından oluşur. Kurulum, derleme veya sunucu uygulaması gerekmez. İlk ziyaret İngilizce ve koyu temada açılır; dil ve tema seçimleri hatırlanır.

## Mobil kullanım

- Üstteki dil ve tema düğmeleri tek dokunuşla değişir. Fareyle üzerine gelince hafif ışık, dokununca basılma geri bildirimi verir.
- Menü, tüm bölümlere geçiş sunar. Dil ve tema üst çubuktan değiştirilir; menü kapanınca okuduğun konum korunur.
- Görsel karşılaştırmasındaki ayırıcı ilk göründüğünde iki kez hafifçe hareket eder ve iki yana dalga yayarak durur. Dokunulduğunda ipucu hemen sona erer; ayırıcı sürüklenebilir veya klavyenin ok tuşlarıyla kullanılabilir.
- Görüntü kalitesi ve nesne tespiti sekmeleri arasında metinler yumuşakça değişir; seçili sekme işareti kayar ve içerik alanının yüksekliği sabit kalır.
- Küçük ayrıntılar ve yoğun sahneler seçiminde aynı temsili görüntü küçük bir tekneye yaklaşır veya limanın geneline açılır. Seçili satır, ok ve görseldeki odak işaretleri yumuşak geçişlerle değişir.
- Yol haritasındaki dört aşama çember ve bağlantı çizgileriyle gösterilir. Mevcut aşama proje önerisidir; sonraki aşamalar planlanıyor olarak kalır. Çember ve adımlar ilk göründüklerinde kısa bir giriş hareketi yapar.
- Sorular yumuşak bir geçişle açılıp kapanır. Azaltılmış hareket tercihi açıksa bu hareketler gösterilmez.
- Telefonlarda yöntem adımları tek sütunda, açıklamalar daha okunaklı boyutta gösterilir.

## Dosyalar

- `index.html`: ana sayfa ve bölümler
- `styles.css`: görünüm, animasyonlar ve ekran uyumu
- `content.js`: Türkçe ve İngilizce metinler
- `app.js`: dil, tema, karşılaştırma ve menü etkileşimleri
- `assets/`: görseller ve site simgesi
- `.nojekyll`: GitHub Pages için statik dosya ayarı
- `.gitignore`: bilgisayara özel gereksiz dosyaları dışarıda tutar

## Site ve depo

- Site: [ilkeozcendek.github.io/keskin](https://ilkeozcendek.github.io/keskin/)
- Kaynak kodu: [IlkeOzcendek/keskin](https://github.com/IlkeOzcendek/keskin)

Site GitHub Pages üzerinden sunulur. Yayın kaynağı `main` dalının kök dizinidir (`/`). Derleme veya paket kurulumu gerekmez; `.nojekyll` dosyası statik dosyaların doğrudan yayınlanmasını sağlar.

## Siteyi güncelleme

1. İlgili HTML, CSS veya JavaScript dosyasını düzenle.
2. `index.html` dosyasını tarayıcıda açarak kontrol et.
3. Değişiklikleri bu deponun `main` dalına gönder.
4. GitHub Pages yayını otomatik olarak günceller. Yayın durumunu deponun **Actions** veya **Settings → Pages** bölümünden takip edebilirsin.

Yeni belgeler eklerken yalnızca paylaşılmaya hazır dosyaları depoya koy ve Belgeler bölümündeki bağlantıları güncelle. Temsili görseller, model çıktıları ve gerçek deney sonuçları birbirinden açıkça ayrılmalıdır.

## Görseller ve içerik

Radar görseli yapay zekâyla üretilmiş temsili bir sahnedir. Gerçek SAR verisi, model çıktısı veya ölçülmüş deney sonucu değildir. Site içindeki temsili görsel açıklamaları korunmuştur. Raporlar hazır olduğunda Belgeler bölümüne eklenebilir.

Sora ve Manrope yazı tipleri Google Fonts üzerinden yüklenir; yüklenemediklerinde yedek yazı tipi kullanılır. Görseller, stiller ve betikler göreli yollarla bağlandığı için proje adı içeren GitHub Pages adresleriyle uyumludur.

Canonical adresi ve sosyal paylaşım etiketleri GitHub Pages adresini kullanır.

## Resmî rehberler

- [GitHub Pages nedir?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Yayın kaynağını ayarlama](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
