# Per-item catalogue images

Each file is `{imageSlug}.jpg` (kebab-case product name from `src/data/request-catalog.ts`).

**Refresh all images** (Open Food Facts + Wikimedia, ~5–8 minutes):

```bash
npm run catalog:images
```

App fallback if a file is missing:

1. `/catalog/items/{imageSlug}.jpg`
2. `/catalog/{categoryId}.jpg`
