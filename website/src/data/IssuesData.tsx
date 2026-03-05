import { Issue } from '../pages/MainPage/ArticleCard';
import { MOCK_ARTICLES } from './MockArticles';

// Resimleri proje içi yollardan da alabiliriz, burada örnek olarak dışarıdan veya public dizininden gösteriyoruz.
const GH_COVER = '/gh-kapak/gh.jpg';
const GH_499 = '/gh-kapak/GH - Sayı_ 499 - 1 Ekim 2025_page-0001.jpg';
const GH_502 = '/gh-kapak/GH - Sayı_ 502 - 12 Kasım 2025 (1)_page-0001.jpg';

export const MOCK_ISSUES: Issue[] = [
    {
        title: "Sayı 504",
        number: 504,
        date: new Date("2025-11-20"),
        coverMedia: {
            type: "image",
            src: GH_COVER,
            alt: "Genç Hayat Sayı 504 Kapak",
            mediaLayout: "full-width"
        },
        sunuArticle: MOCK_ARTICLES.find(a => a.type === "sunu" && a.issueNumber === 504) || MOCK_ARTICLES[0],
        rotaArticle: MOCK_ARTICLES.find(a => a.type === "rota" && a.issueNumber === 504) || MOCK_ARTICLES[1],
        recomendedCards: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(0, 4),
        otherArticles: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(4, 12)
    },
    {
        title: "Sayı 503",
        number: 503,
        date: new Date("2025-10-15"),
        coverMedia: {
            type: "image",
            src: GH_COVER,
            alt: "Genç Hayat Sayı 503 Kapak",
            mediaLayout: "full-width"
        },
        sunuArticle: MOCK_ARTICLES[0], // fallback if specific 503 sunu isn't present yet
        rotaArticle: MOCK_ARTICLES[1], // fallback
        recomendedCards: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(5, 9),
        otherArticles: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(9, 17)
    },
    {
        title: "Sayı 502",
        number: 502,
        date: new Date("2025-11-12"),
        coverMedia: {
            type: "image",
            src: GH_502,
            alt: "Genç Hayat Sayı 502 Kapak",
            mediaLayout: "full-width"
        },
        sunuArticle: MOCK_ARTICLES[0],
        rotaArticle: MOCK_ARTICLES[1],
        recomendedCards: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(1, 5),
        otherArticles: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(10, 18)
    },
    {
        title: "Sayı 501",
        number: 501,
        date: new Date("2025-08-10"),
        coverMedia: {
            type: "image",
            src: GH_COVER,
            alt: "Genç Hayat Sayı 501 Kapak",
            mediaLayout: "full-width"
        },
        sunuArticle: MOCK_ARTICLES[0],
        rotaArticle: MOCK_ARTICLES[1],
        recomendedCards: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(3, 7),
        otherArticles: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(14, 22)
    },
    {
        title: "Sayı 500",
        number: 500,
        date: new Date("2025-07-05"),
        coverMedia: {
            type: "image",
            src: GH_COVER,
            alt: "Genç Hayat Sayı 500 Kapak",
            mediaLayout: "full-width"
        },
        sunuArticle: MOCK_ARTICLES[0],
        rotaArticle: MOCK_ARTICLES[1],
        recomendedCards: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(6, 10),
        otherArticles: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(15, 23)
    },
    {
        title: "Sayı 499",
        number: 499,
        date: new Date("2025-10-01"),
        coverMedia: {
            type: "image",
            src: GH_499,
            alt: "Genç Hayat Sayı 499 Kapak",
            mediaLayout: "full-width"
        },
        sunuArticle: MOCK_ARTICLES[0],
        rotaArticle: MOCK_ARTICLES[1],
        recomendedCards: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(2, 6),
        otherArticles: MOCK_ARTICLES.filter(a => a.type === "featured" || a.type === "normal").slice(8, 16)
    }
];
