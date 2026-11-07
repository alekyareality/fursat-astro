# Schema.org Structured Data (`ld.json`) Pending Confirmations

The following unconfirmed fields were removed from `src/data/ld.json` during the `integration/dev-port` merge to adhere strictly to the site accuracy policy:

## 1. `aggregateRating`
- **Removed Payload**:
  ```json
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "180",
    "bestRating": "5",
    "worstRating": "1"
  }
  ```
- **Reason**: Review score (`4.6`) and review count (`180`) require verified client confirmation or direct Google / Zomato review integration link.

## 2. `openingHoursSpecification`
- **Removed Payload**:
  ```json
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "12:00",
      "closes": "23:30"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday","Sunday"],
      "opens": "11:00",
      "closes": "23:30"
    }
  ]
  ```
- **Reason**: Opening hours must be verified with restaurant management before publishing structured opening hours to Google Rich Results.

## 3. `priceRange`
- **Removed Payload**:
  ```json
  "priceRange": "₹₹"
  ```
- **Reason**: Unconfirmed price range indicator.

---

## Retained Valid Fields
- `description`: `"Fursat Kitchen | Bar at Capital Park, Madhapur, Hyderabad: a café, kitchen, bar and banquet space. Ask Fursat for dishes by mood."` (Removed outdated placeholder "New website coming soon.")
- `image`: `"https://fursatind.in/assets/fursat_space_01.webp"` (High-resolution WebP hero venue photo)
- `servesCuisine`, `telephone`, `address`, `sameAs`, and WebSite schema.
