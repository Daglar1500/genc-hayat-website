# Genç Hayat — Mimari Diyagramlar

Proje üç katmana bölünmüştür:

| Diyagram | İçerik |
|----------|--------|
| [1 — Veri Modelleri & Backend](diagram-1-data-backend.md) | `Article`, `Section`, `Issue`, `Category`, JSON depolama, PHP API servisi |
| [2 — Admin Panel](diagram-2-admin-panel.md) | React bileşenleri, view'lar, modal'lar, undo/redo, template yönetimi |
| [3 — Website Frontend](diagram-3-website.md) | Sayfalar, section bileşenleri, `ArticleCard`, `Labelo`, context'ler |

## Katman İlişkisi

```
Website Frontend  ──GET /api/init──►  PHP ApiService
Admin Panel       ──POST/PUT/DEL──►  PHP ApiService
                                           │
                                     JsonStorage
                                           │
                               articles.json / sections.json
                               section_articles.json / issues.json
```
