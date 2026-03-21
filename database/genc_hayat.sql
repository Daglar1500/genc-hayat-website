-- phpMyAdmin SQL Dump
-- Genç Hayat Web Sitesi — Veritabanı Şeması
-- Evrensel Gazetesi Genç Hayat Eki
--
-- Anamakine: localhost:3306
-- Oluşturulma: 2026
-- Sunucu sürümü: 8.0+
-- PHP Sürümü: 8.1+

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+03:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `genc_hayat`
--

CREATE DATABASE IF NOT EXISTS `genc_hayat`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `genc_hayat`;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kategoriler`
--

CREATE TABLE `kategoriler` (
  `kategori_id`   INT           NOT NULL,
  `kategori_adi`  varchar(100)  NOT NULL COMMENT 'Kategorinin görünen adı (ör. Güncel, Tarih, Kültür-Sanat)',
  `kategori_renk` varchar(20)   NOT NULL DEFAULT '#90CAF9' COMMENT 'Hex renk kodu (ör. #90CAF9)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- `kategoriler` için örnek veriler
--

INSERT INTO `kategoriler` (`kategori_id`, `kategori_adi`, `kategori_renk`) VALUES
(1, 'Güncel',       '#90CAF9'),
(2, 'Tarih',        '#CE93D8'),
(3, 'Kuram',        '#80CBC4'),
(4, 'Felsefe',      '#FFCC80'),
(5, 'Kültür-Sanat', '#F48FB1'),
(6, 'Dünya',        '#A5D6A7'),
(7, 'Spor',         '#80DEEA');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `etiketler`
--

CREATE TABLE `etiketler` (
  `etiket_id`  INT          NOT NULL,
  `etiket_adi` varchar(150) NOT NULL COMMENT 'Etiketin adı (ör. Marksizm, Kapitalizm)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- `etiketler` için örnek veriler
--

INSERT INTO `etiketler` (`etiket_id`, `etiket_adi`) VALUES
(1,  'Felsefe'),
(2,  'Düşünce Tarihi'),
(3,  'Marksizm'),
(4,  'Kadın'),
(5,  'Sosyal Teori'),
(6,  'Postmodernizm'),
(7,  'Eleştirel Teori'),
(8,  'Varoluşçuluk'),
(9,  'Aydınlanma'),
(10, 'Kuram'),
(11, 'Bilim Felsefesi'),
(12, 'Etik ve Ahlak'),
(13, 'İnsan Doğası'),
(14, 'Yabancılaşma'),
(15, 'Diyalektik Materyalizm'),
(16, 'Tarihsel Materyalizm'),
(17, 'Materyalizm'),
(18, 'İdealizm'),
(19, 'Pozitivizm'),
(20, 'Yapısalcılık'),
(21, 'Anti-Emperyalizm'),
(22, 'Emperyalizm'),
(23, 'Kapitalizm'),
(24, 'Sosyalizm'),
(25, 'Komünizm'),
(26, 'Faşizm'),
(27, 'Neoliberalizm'),
(28, 'Antifaşizm'),
(29, 'Ulusal Kurtuluş Mücadeleleri'),
(30, 'Kürt Hareketi'),
(31, 'Anadil'),
(32, 'Sınıf Mücadelesi'),
(33, 'Sosyoloji'),
(34, 'Gençlik Sosyolojisi'),
(35, 'Toplumsal Cinsiyet'),
(36, 'Psikoloji'),
(37, 'Akran İlişkileri'),
(38, 'Kent Sosyolojisi'),
(39, 'Göç'),
(40, 'Yoksulluk'),
(41, 'Eşitsizlik'),
(42, 'Birey ve Toplum'),
(43, 'Ekoloji'),
(44, 'Teknoloji');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `editorler`
--

CREATE TABLE `editorler` (
  `editor_id`  INT          NOT NULL,
  `editor_adi` varchar(150) NOT NULL COMMENT 'Editörün adı soyadı'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yazilar`
--

CREATE TABLE `yazilar` (
  `yazi_id`          INT          NOT NULL,
  `yazi_slug`        varchar(500) DEFAULT NULL COMMENT 'SEO dostu URL (ör. diyalektigin-izinde). Boşsa yazi_id kullanılır.',
  `yazi_turu`        enum('normal','featured','sunu','rota') NOT NULL DEFAULT 'normal'
                     COMMENT 'normal=Standart yazı, featured=Öne çıkan, sunu=Sayı sunusu, rota=Rota yazısı',
  `yazi_baslik`      varchar(500) NOT NULL COMMENT 'Yazının başlığı',
  `yazi_alt_baslik`  varchar(500) DEFAULT NULL COMMENT 'Alt başlık / kısa özet',
  `yazi_yazar`       varchar(200) NOT NULL COMMENT 'Yazarın adı soyadı',
  `yazi_editor_id`   INT          DEFAULT NULL COMMENT 'editorler tablosuna FK',
  `yazi_sehir`       varchar(150) DEFAULT NULL COMMENT 'Yazarın bulunduğu şehir',
  `yazi_okul`        varchar(200) DEFAULT NULL COMMENT 'Yazarın okulu',
  `yazi_icerik`      JSON         DEFAULT NULL COMMENT 'İçerik blokları (ContentBlock[])',
  `yazi_resim`       varchar(500) DEFAULT NULL COMMENT 'Kapak görseli URL',
  `yazi_kategori_id` INT          DEFAULT NULL COMMENT 'kategoriler tablosuna FK',
  `yazi_sayi_no`     varchar(20)  DEFAULT NULL COMMENT 'Yayımlandığı sayı numarası (ör. 504)',
  `yazi_tarih`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Oluşturulma tarihi',
  `yazi_durum`       enum('edited','not-edited') NOT NULL DEFAULT 'not-edited'
                     COMMENT 'Editör onay durumu',
  `yazi_goruntuleme` INT          NOT NULL DEFAULT 0 COMMENT 'Görüntülenme sayısı',
  `yazi_silindi`     tinyint(1)   NOT NULL DEFAULT 0 COMMENT '0=Aktif, 1=Çöp kutusunda',
  `yazi_silinme_tarihi` timestamp NULL DEFAULT NULL COMMENT 'Çöp kutusuna atılma tarihi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yazi_etiketleri`
-- Yazı ile etiket arasındaki çoka-çok ilişkisi
--

CREATE TABLE `yazi_etiketleri` (
  `kayit_id`  INT NOT NULL,
  `yazi_id`   INT NOT NULL COMMENT 'yazilar.yazi_id',
  `etiket_id` INT NOT NULL COMMENT 'etiketler.etiket_id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yazi_onerilen`
-- Bir yazının önerdiği diğer yazılar (recommendedArticleIds)
--

CREATE TABLE `yazi_onerilen` (
  `kayit_id`         INT NOT NULL,
  `yazi_id`          INT NOT NULL COMMENT 'Öneren yazı',
  `onerilen_yazi_id` INT NOT NULL COMMENT 'Önerilen yazı',
  `sira`             INT NOT NULL DEFAULT 0 COMMENT 'Gösterim sırası'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sayilar`
--

CREATE TABLE `sayilar` (
  `sayi_id`        INT          NOT NULL,
  `sayi_baslik`    varchar(200) NOT NULL COMMENT 'Sayının başlığı (ör. Sayı 504)',
  `sayi_no`        INT          NOT NULL COMMENT 'Sayı numarası (ör. 504)',
  `sayi_tarih`     date         NOT NULL COMMENT 'Yayın tarihi',
  `kapak_tur`      enum('image','video') DEFAULT 'image' COMMENT 'Kapak medya türü',
  `kapak_src`      varchar(500) DEFAULT NULL COMMENT 'Kapak görseli veya video URL',
  `kapak_alt`      varchar(300) DEFAULT NULL COMMENT 'Kapak görseli alt metni',
  `kapak_mizanpaj` varchar(50)  DEFAULT NULL COMMENT 'Görsel yerleşim stili (ör. cover, contain)',
  `sunu_yazi_id`   INT          DEFAULT NULL COMMENT 'Sayı sunusu yazısı (sunuArticleId)',
  `rota_yazi_id`   INT          DEFAULT NULL COMMENT 'Rota yazısı (rotaArticleId)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sayi_yazilari`
-- Sayı ile yazı arasındaki ilişki (önerilen + diğer yazılar)
--

CREATE TABLE `sayi_yazilari` (
  `kayit_id` INT NOT NULL,
  `sayi_id`  INT NOT NULL COMMENT 'sayilar.sayi_id',
  `yazi_id`  INT NOT NULL COMMENT 'yazilar.yazi_id',
  `tur`      enum('onerilen','diger') NOT NULL DEFAULT 'diger'
             COMMENT 'onerilen=Önerilen kart, diger=Diğer yazılar listesi',
  `sira`     INT NOT NULL DEFAULT 0 COMMENT 'Gösterim sırası'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `bolumler`
-- Ana sayfa bölüm düzeni (sections.json karşılığı)
--

CREATE TABLE `bolumler` (
  `bolum_id`        INT         NOT NULL,
  `bolum_kodu`      varchar(50) NOT NULL COMMENT 'Sabit tekil tanımlayıcı (ör. sec-main, sec-feed)',
  `bolum_turu`      enum(
    'main-row',
    'category-row',
    'ordinary-row',
    'spot-row',
    'article-feed',
    'video-row',
    'spotify-row',
    'letterboxd-row',
    'archive-row'
  ) NOT NULL COMMENT 'Bölümün render tipi',
  `bolum_basligi`   varchar(200) DEFAULT NULL COMMENT 'Bölüm başlığı (varsa)',
  `bolum_sabitlemi` tinyint(1)   NOT NULL DEFAULT 0 COMMENT '1=Sabitlenmiş (isPinned)',
  `bolum_gorunum`   tinyint(1)   NOT NULL DEFAULT 1 COMMENT '1=Görünür (isVisible)',
  `bolum_kapak`     varchar(500) DEFAULT NULL COMMENT 'Bölüm kapak görseli URL',
  `bolum_on_sozu`   text         DEFAULT NULL COMMENT 'Bölüm ön sözü (preface)',
  `bolum_sayi_no`   varchar(20)  DEFAULT NULL COMMENT 'Arşiv bölümü için sayı numarası',
  `rota_yazi_id`    INT          DEFAULT NULL COMMENT 'Bölümün rota/öne çıkan yazısı (routeArticleId)',
  `bolum_ayar`      JSON         DEFAULT NULL COMMENT 'Ek ayarlar (video URL, spotify URL vb.)',
  `bolum_sira`      INT          NOT NULL DEFAULT 0 COMMENT 'Bölümlerin ana sayfadaki gösterim sırası'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- `bolumler` için örnek veriler (sections.json karşılığı)
--

INSERT INTO `bolumler`
  (`bolum_id`, `bolum_kodu`, `bolum_turu`, `bolum_basligi`, `bolum_sabitlemi`, `bolum_gorunum`, `bolum_sira`) VALUES
(1, 'sec-main',        'main-row',        'Ana Bölüm',      1, 1, 1),
(2, 'sec-ord',         'ordinary-row',    NULL,              0, 1, 2),
(3, 'sec-spot',        'spot-row',        NULL,              0, 1, 3),
(4, 'sec-cat-1',       'category-row',    NULL,              0, 1, 4),
(5, 'sec-feed',        'article-feed',    'Yazı Akışı',      0, 1, 5),
(6, 'sec-video',       'video-row',       'Video',           0, 1, 6),
(7, 'sec-spotify',     'spotify-row',     'Spotify',         0, 1, 7),
(8, 'sec-letterboxd',  'letterboxd-row',  'Letterboxd',      0, 1, 8),
(9, 'sec-archive',     'archive-row',     'Arşiv',           0, 1, 9);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `bolum_yazilari`
-- Bölüm ile yazı arasındaki sıralı ilişki (section_articles.json karşılığı)
--

CREATE TABLE `bolum_yazilari` (
  `kayit_id` INT NOT NULL,
  `bolum_id` INT NOT NULL COMMENT 'bolumler.bolum_id',
  `yazi_id`  INT NOT NULL COMMENT 'yazilar.yazi_id',
  `sira`     INT NOT NULL DEFAULT 0 COMMENT 'Bölüm içindeki gösterim sırası'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yorumlar`
--

CREATE TABLE `yorumlar` (
  `yorum_id`    INT        NOT NULL,
  `yazi_id`     INT        NOT NULL COMMENT 'yazilar.yazi_id',
  `yorum_metin` text       NOT NULL COMMENT 'Yorumun içeriği',
  `yorum_tarih` timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Yorumun oluşturulma tarihi',
  `okundu`      tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=Okunmadı, 1=Okundu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sablonlar`
-- Admin panelindeki kayıtlı düzen şablonları
--

CREATE TABLE `sablonlar` (
  `sablon_id`      INT          NOT NULL,
  `sablon_adi`     varchar(200) NOT NULL COMMENT 'Şablonun adı (admin panelde gösterilir)',
  `sablon_bolumler` JSON        NOT NULL COMMENT 'Bölüm düzeni (Section[] JSON dizisi)',
  `sablon_tarih`   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Oluşturulma tarihi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- PRIMARY KEY ve AUTO_INCREMENT tanımları
-- ========================================================

ALTER TABLE `kategoriler`
  ADD PRIMARY KEY (`kategori_id`);

ALTER TABLE `etiketler`
  ADD PRIMARY KEY (`etiket_id`),
  ADD UNIQUE KEY `uq_etiket_adi` (`etiket_adi`);

ALTER TABLE `editorler`
  ADD PRIMARY KEY (`editor_id`),
  ADD UNIQUE KEY `uq_editor_adi` (`editor_adi`);

ALTER TABLE `yazilar`
  ADD PRIMARY KEY (`yazi_id`),
  ADD UNIQUE KEY `uq_yazi_slug` (`yazi_slug`(191)),
  ADD KEY `idx_yazi_kategori` (`yazi_kategori_id`),
  ADD KEY `idx_yazi_editor` (`yazi_editor_id`),
  ADD KEY `idx_yazi_sayi_no` (`yazi_sayi_no`),
  ADD KEY `idx_yazi_tarih` (`yazi_tarih`),
  ADD KEY `idx_yazi_silindi` (`yazi_silindi`);

ALTER TABLE `yazi_etiketleri`
  ADD PRIMARY KEY (`kayit_id`),
  ADD UNIQUE KEY `uq_yazi_etiket` (`yazi_id`, `etiket_id`),
  ADD KEY `idx_ye_yazi` (`yazi_id`),
  ADD KEY `idx_ye_etiket` (`etiket_id`);

ALTER TABLE `yazi_onerilen`
  ADD PRIMARY KEY (`kayit_id`),
  ADD UNIQUE KEY `uq_onerilen` (`yazi_id`, `onerilen_yazi_id`),
  ADD KEY `idx_yo_yazi` (`yazi_id`),
  ADD KEY `idx_yo_onerilen` (`onerilen_yazi_id`);

ALTER TABLE `sayilar`
  ADD PRIMARY KEY (`sayi_id`),
  ADD UNIQUE KEY `uq_sayi_no` (`sayi_no`),
  ADD KEY `idx_sayi_tarih` (`sayi_tarih`),
  ADD KEY `idx_sunu_yazi` (`sunu_yazi_id`),
  ADD KEY `idx_rota_yazi` (`rota_yazi_id`);

ALTER TABLE `sayi_yazilari`
  ADD PRIMARY KEY (`kayit_id`),
  ADD UNIQUE KEY `uq_sayi_yazi` (`sayi_id`, `yazi_id`),
  ADD KEY `idx_sw_sayi` (`sayi_id`),
  ADD KEY `idx_sw_yazi` (`yazi_id`);

ALTER TABLE `bolumler`
  ADD PRIMARY KEY (`bolum_id`),
  ADD UNIQUE KEY `uq_bolum_kodu` (`bolum_kodu`),
  ADD KEY `idx_bolum_sira` (`bolum_sira`),
  ADD KEY `idx_rota_yazi_id` (`rota_yazi_id`);

ALTER TABLE `bolum_yazilari`
  ADD PRIMARY KEY (`kayit_id`),
  ADD UNIQUE KEY `uq_bolum_yazi` (`bolum_id`, `yazi_id`),
  ADD KEY `idx_bw_bolum` (`bolum_id`),
  ADD KEY `idx_bw_yazi` (`yazi_id`);

ALTER TABLE `yorumlar`
  ADD PRIMARY KEY (`yorum_id`),
  ADD KEY `idx_yorum_yazi` (`yazi_id`),
  ADD KEY `idx_yorum_okundu` (`okundu`);

ALTER TABLE `sablonlar`
  ADD PRIMARY KEY (`sablon_id`);

-- ========================================================
-- AUTO_INCREMENT başlangıç değerleri
-- ========================================================

ALTER TABLE `kategoriler`     MODIFY `kategori_id` INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
ALTER TABLE `etiketler`       MODIFY `etiket_id`   INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
ALTER TABLE `editorler`       MODIFY `editor_id`   INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `yazilar`         MODIFY `yazi_id`     INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `yazi_etiketleri` MODIFY `kayit_id`    INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `yazi_onerilen`   MODIFY `kayit_id`    INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `sayilar`         MODIFY `sayi_id`     INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `sayi_yazilari`   MODIFY `kayit_id`    INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `bolumler`        MODIFY `bolum_id`    INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE `bolum_yazilari`  MODIFY `kayit_id`    INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `yorumlar`        MODIFY `yorum_id`    INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE `sablonlar`       MODIFY `sablon_id`   INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

-- ========================================================
-- FOREIGN KEY kısıtları
-- ========================================================

ALTER TABLE `yazilar`
  ADD CONSTRAINT `fk_yazi_kategori`
    FOREIGN KEY (`yazi_kategori_id`) REFERENCES `kategoriler` (`kategori_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_yazi_editor`
    FOREIGN KEY (`yazi_editor_id`) REFERENCES `editorler` (`editor_id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `yazi_etiketleri`
  ADD CONSTRAINT `fk_ye_yazi`
    FOREIGN KEY (`yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ye_etiket`
    FOREIGN KEY (`etiket_id`) REFERENCES `etiketler` (`etiket_id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `yazi_onerilen`
  ADD CONSTRAINT `fk_yo_yazi`
    FOREIGN KEY (`yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_yo_onerilen`
    FOREIGN KEY (`onerilen_yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `sayilar`
  ADD CONSTRAINT `fk_sayi_sunu`
    FOREIGN KEY (`sunu_yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sayi_rota`
    FOREIGN KEY (`rota_yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `sayi_yazilari`
  ADD CONSTRAINT `fk_sw_sayi`
    FOREIGN KEY (`sayi_id`) REFERENCES `sayilar` (`sayi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sw_yazi`
    FOREIGN KEY (`yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `bolumler`
  ADD CONSTRAINT `fk_bolum_rota`
    FOREIGN KEY (`rota_yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `bolum_yazilari`
  ADD CONSTRAINT `fk_bw_bolum`
    FOREIGN KEY (`bolum_id`) REFERENCES `bolumler` (`bolum_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bw_yazi`
    FOREIGN KEY (`yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `yorumlar`
  ADD CONSTRAINT `fk_yorum_yazi`
    FOREIGN KEY (`yazi_id`) REFERENCES `yazilar` (`yazi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
