# StoreHub

## 1. How to Run the Application
### Live Version at: https://hristo-store-hub.netlify.app/
### Installation
```bash
# Install dependencies, open the project folder and run:
npm install
```
### Development
Run both commands in separate terminals:
```bash
# Terminal 1 — Mock API (port 3001)
npm run api
# Terminal 2 — Dev server (port 5173)
npm run dev
```
Then open http://localhost:5173

## 2. Technologies Used
| Layer | Technology |
|---|---|
| Framework | Vue 3 — Composition API with `<script setup>` |
| Language | TypeScript — strict typing throughout components, stores, and utilities |
| State Management | Pinia — Composition API stores for products, cart, and toast notifications |
| Routing | Vue Router 4 — lazy-loaded views and dynamic category segments |
| Styling | Tailwind CSS v4 — utility-first, no custom CSS written |
| Build Tool | Vite 7
| Mock API | json-server — serves `db.json` as a REST endpoint on port 3001

## 3. What Has Been Implemented
### Product Listing & Navigation
- Category-based routing with four categories: Bags, Shoes, Jackets, and Hats
- Dynamic product grid with responsive 2-column (mobile) and 3-column (desktop) layout
- Product detail page with full description, stock indicator, and Add to Cart functionality
- Lazy-loaded route components for optimal initial load performance
### Filtering & Sorting
- Color filter with checkboxes — dynamically generated from available products in the current category
- Price range dual-slider that adapts its min/max to the currently visible products after other filters are applied
- Star rating filter (1 Star Up to 5 Stars)
- Sort options: Name A–Z, Name Z–A, Price Low–High, Price High–Low, Rating
- Reset button to clear all active filters at once
### Search
- Live search dropdown in the header — triggers after 2 characters
- Results show product image, name, category, and price
- On mobile, the dropdown is fixed to the full screen width to prevent overflow
### Shopping Cart
- Add to Cart from both listing and detail pages with toast notification feedback
- Cart persists across page refreshes using `localStorage`
- Quantity management (increment, decrement, remove) with live stock validation
- Order summary with subtotal, discount savings, and total
### UX & Accessibility
- Responsive design — fully optimised for mobile, tablet, and desktop
- Discount badge showing percentage saved
- Low stock warning ("Only N left!") on product cards
- Accessible checkboxes with matching `for`/`id` attributes on colour filters
- 404 Not Found page for unknown routes

## 4. How the Solution Was Achieved
### Architecture
The application follows a clean separation of concerns. Data fetching lives exclusively in the Pinia products store, which exposes the full product list and loading/error states. All filtering, sorting, and pagination logic is handled inside the `ProductListing` view through computed properties — meaning the store stays simple and the view remains the single source of truth for what is currently displayed.
### Filtering Pipeline
Filters are applied in a deliberate pipeline order inside a single `filteredProducts` computed property:
1. Category match (from the route parameter)
2. Color filter (multi-select)
3. Rating filter (minimum threshold)
4. Price range filter (min / max slider values)

The price slider range is itself a computed property (`dynamicPriceRange`) that recalculates based on the products remaining after colour and rating filters are applied. This means the slider always reflects what is actually available.
### Cart Persistence
The cart store initialises its `items` ref by reading from `localStorage` on startup. A deep watcher then serialises the cart back to `localStorage` on every change, giving the user a persistent cart across sessions without any backend.
### Routing & Categories
Categories are defined once in `src/constants/categories.ts` and imported everywhere they are needed — the router, the header navigation, and the footer. This eliminates duplication and ensures any future category change only requires a single edit.
### Search
The search dropdown queries the full product list in-memory and navigates directly to the product detail page on selection, making it instant without any network requests.
- Search by: category or product name
  
## 5. Challenges Encountered
### Reactive Filter Synchronisation — The Core Challenge
The most significant challenge was building a filter system where multiple reactive values depend on each other without creating infinite update loops or race conditions.
