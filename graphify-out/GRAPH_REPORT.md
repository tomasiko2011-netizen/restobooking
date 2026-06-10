# Graph Report - .  (2026-06-11)

## Corpus Check
- Corpus is ~18,517 words - fits in a single context window. You may not need a graph.

## Summary
- 598 nodes · 682 edges · 48 communities (41 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core App Pages & DB Schema|Core App Pages & DB Schema]]
- [[_COMMUNITY_DB Migration Payments Columns|DB Migration Payments Columns]]
- [[_COMMUNITY_DB Migration Cities Columns|DB Migration Cities Columns]]
- [[_COMMUNITY_DB Migration Pricing Time Fields|DB Migration Pricing Time Fields]]
- [[_COMMUNITY_Package Dependencies Config|Package Dependencies Config]]
- [[_COMMUNITY_Booking UI Components|Booking UI Components]]
- [[_COMMUNITY_DB Migration Schema Constraints|DB Migration Schema Constraints]]
- [[_COMMUNITY_DB Migration Restaurant Photos|DB Migration Restaurant Photos]]
- [[_COMMUNITY_DB Migration Reservations Foreign Keys|DB Migration Reservations Foreign Keys]]
- [[_COMMUNITY_DB Migration Payments Indexes|DB Migration Payments Indexes]]
- [[_COMMUNITY_TypeScript Build Config|TypeScript Build Config]]
- [[_COMMUNITY_DB Migration Pricing Rules Constraints|DB Migration Pricing Rules Constraints]]
- [[_COMMUNITY_DB Migration Reservation Indexes|DB Migration Reservation Indexes]]
- [[_COMMUNITY_PWA Web Manifest|PWA Web Manifest]]
- [[_COMMUNITY_App Shell Navigation|App Shell Navigation]]
- [[_COMMUNITY_City Detection & Home Page|City Detection & Home Page]]
- [[_COMMUNITY_DB Migration Cancelled At Field|DB Migration Cancelled At Field]]
- [[_COMMUNITY_DB Migration Payment Required Field|DB Migration Payment Required Field]]
- [[_COMMUNITY_DB Migration Payment Status Field|DB Migration Payment Status Field]]
- [[_COMMUNITY_DB Migration Rating Field|DB Migration Rating Field]]
- [[_COMMUNITY_DB Migration Review Count Field|DB Migration Review Count Field]]
- [[_COMMUNITY_DB Migration Total Price Field|DB Migration Total Price Field]]
- [[_COMMUNITY_DB Migration Address Field|DB Migration Address Field]]
- [[_COMMUNITY_DB Migration City FK Field|DB Migration City FK Field]]
- [[_COMMUNITY_DB Migration Confirmed At Field|DB Migration Confirmed At Field]]
- [[_COMMUNITY_DB Migration Cuisine Field|DB Migration Cuisine Field]]
- [[_COMMUNITY_DB Migration Date Field|DB Migration Date Field]]
- [[_COMMUNITY_DB Migration Description Field|DB Migration Description Field]]
- [[_COMMUNITY_DB Migration Guests Field|DB Migration Guests Field]]
- [[_COMMUNITY_DB Migration Note Field|DB Migration Note Field]]
- [[_COMMUNITY_DB Migration Owner ID Field|DB Migration Owner ID Field]]
- [[_COMMUNITY_DB Migration Phone Field|DB Migration Phone Field]]
- [[_COMMUNITY_DB Migration Photo URL Field|DB Migration Photo URL Field]]
- [[_COMMUNITY_DB Migration Time Field|DB Migration Time Field]]
- [[_COMMUNITY_CI Workflow & Readme|CI Workflow & Readme]]
- [[_COMMUNITY_Database Seed Script|Database Seed Script]]
- [[_COMMUNITY_Drizzle Migration Journal|Drizzle Migration Journal]]
- [[_COMMUNITY_DB Migration Price Range Field|DB Migration Price Range Field]]
- [[_COMMUNITY_Restaurant Registration Page|Restaurant Registration Page]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_PWA Service Worker|PWA Service Worker]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `columns` - 16 edges
2. `columns` - 16 edges
3. `compilerOptions` - 16 edges
4. `DB` - 13 edges
5. `restaurants` - 11 edges
6. `created_at` - 10 edges
7. `columns` - 10 edges
8. `columns` - 9 edges
9. `columns` - 9 edges
10. `reservations` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GitHub Actions CI (lint / typecheck / build)` --references--> `Next.js`  [INFERRED]
  .github/workflows/ci.yml → README.md
- `GitHub Actions CI (lint / typecheck / build)` --references--> `Vercel hosting`  [EXTRACTED]
  .github/workflows/ci.yml → README.md
- `Post-deploy HTTP health check` --references--> `Vercel hosting`  [EXTRACTED]
  .github/workflows/ci.yml → README.md
- `GET()` --calls--> `getCities()`  [EXTRACTED]
  src/app/api/cities/route.ts → src/lib/queries.ts
- `HomePage()` --calls--> `getCities()`  [EXTRACTED]
  src/app/page.tsx → src/lib/queries.ts

## Import Cycles
- None detected.

## Communities (48 total, 7 thin omitted)

### Community 0 - "Core App Pages & DB Schema"
Cohesion: 0.09
Nodes (20): GET(), Props, client, DB, cities, payments, pricingRules, reservations (+12 more)

### Community 1 - "DB Migration Payments Columns"
Cohesion: 0.05
Nodes (39): autoincrement, name, notNull, primaryKey, type, amount, provider, provider_ref (+31 more)

### Community 2 - "DB Migration Cities Columns"
Cohesion: 0.05
Nodes (39): columns, is_active, lat, lng, name, slug, timezone, autoincrement (+31 more)

### Community 3 - "DB Migration Pricing Time Fields"
Cohesion: 0.05
Nodes (38): created_at, day_of_week, label, multiplier, time_end, time_start, autoincrement, default (+30 more)

### Community 4 - "Package Dependencies Config"
Cohesion: 0.06
Nodes (34): dependencies, drizzle-orm, leaflet, @libsql/client, next, next-auth, pusher, pusher-js (+26 more)

### Community 5 - "Booking UI Components"
Cohesion: 0.08
Nodes (21): CityPage(), Props, Props, Map, Props, Restaurant, Props, Review (+13 more)

### Community 6 - "DB Migration Schema Constraints"
Cohesion: 0.06
Nodes (33): checkConstraints, compositePrimaryKeys, foreignKeys, indexes, name, columns, isUnique, name (+25 more)

### Community 7 - "DB Migration Restaurant Photos"
Cohesion: 0.06
Nodes (32): autoincrement, name, notNull, primaryKey, type, alt, id, restaurant_id (+24 more)

### Community 8 - "DB Migration Reservations Foreign Keys"
Cohesion: 0.07
Nodes (30): reservations_city_id_cities_id_fk, reservations_restaurant_id_restaurants_id_fk, reservations_user_id_users_id_fk, checkConstraints, columnsFrom, columnsTo, name, onDelete (+22 more)

### Community 9 - "DB Migration Payments Indexes"
Cohesion: 0.07
Nodes (27): payments_reservation_id_reservations_id_fk, payments_user_id_users_id_fk, columns, isUnique, name, idx_payments_reservation, checkConstraints, compositePrimaryKeys (+19 more)

### Community 10 - "TypeScript Build Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "DB Migration Pricing Rules Constraints"
Cohesion: 0.11
Nodes (19): pricing_rules_restaurant_id_restaurants_id_fk, columns, isUnique, name, idx_pricing_restaurant, checkConstraints, compositePrimaryKeys, foreignKeys (+11 more)

### Community 12 - "DB Migration Reservation Indexes"
Cohesion: 0.15
Nodes (13): columns, isUnique, name, columns, isUnique, name, columns, isUnique (+5 more)

### Community 13 - "PWA Web Manifest"
Cohesion: 0.15
Nodes (12): background_color, categories, description, display, icons, lang, name, orientation (+4 more)

### Community 14 - "App Shell Navigation"
Cohesion: 0.17
Nodes (4): geist, metadata, viewport, NAV_ITEMS

### Community 15 - "City Detection & Home Page"
Cohesion: 0.24
Nodes (5): HomePage(), GET(), City, Props, getCities()

### Community 16 - "DB Migration Cancelled At Field"
Cohesion: 0.29
Nodes (7): autoincrement, name, notNull, primaryKey, type, cancelled_at, columns

### Community 17 - "DB Migration Payment Required Field"
Cohesion: 0.29
Nodes (7): payment_required, autoincrement, default, name, notNull, primaryKey, type

### Community 18 - "DB Migration Payment Status Field"
Cohesion: 0.29
Nodes (7): payment_status, autoincrement, default, name, notNull, primaryKey, type

### Community 19 - "DB Migration Rating Field"
Cohesion: 0.29
Nodes (7): rating, autoincrement, default, name, notNull, primaryKey, type

### Community 20 - "DB Migration Review Count Field"
Cohesion: 0.29
Nodes (7): review_count, autoincrement, default, name, notNull, primaryKey, type

### Community 21 - "DB Migration Total Price Field"
Cohesion: 0.29
Nodes (7): total_price, autoincrement, default, name, notNull, primaryKey, type

### Community 23 - "DB Migration Address Field"
Cohesion: 0.33
Nodes (6): autoincrement, name, notNull, primaryKey, type, address

### Community 24 - "DB Migration City FK Field"
Cohesion: 0.33
Nodes (6): autoincrement, name, notNull, primaryKey, type, city_id

### Community 25 - "DB Migration Confirmed At Field"
Cohesion: 0.33
Nodes (6): confirmed_at, autoincrement, name, notNull, primaryKey, type

### Community 26 - "DB Migration Cuisine Field"
Cohesion: 0.33
Nodes (6): cuisine, autoincrement, name, notNull, primaryKey, type

### Community 27 - "DB Migration Date Field"
Cohesion: 0.33
Nodes (6): date, autoincrement, name, notNull, primaryKey, type

### Community 28 - "DB Migration Description Field"
Cohesion: 0.33
Nodes (6): description, autoincrement, name, notNull, primaryKey, type

### Community 29 - "DB Migration Guests Field"
Cohesion: 0.33
Nodes (6): guests, autoincrement, name, notNull, primaryKey, type

### Community 30 - "DB Migration Note Field"
Cohesion: 0.33
Nodes (6): note, autoincrement, name, notNull, primaryKey, type

### Community 31 - "DB Migration Owner ID Field"
Cohesion: 0.33
Nodes (6): owner_id, autoincrement, name, notNull, primaryKey, type

### Community 32 - "DB Migration Phone Field"
Cohesion: 0.33
Nodes (6): phone, autoincrement, name, notNull, primaryKey, type

### Community 33 - "DB Migration Photo URL Field"
Cohesion: 0.33
Nodes (6): photo_url, autoincrement, name, notNull, primaryKey, type

### Community 34 - "DB Migration Time Field"
Cohesion: 0.33
Nodes (6): time, autoincrement, name, notNull, primaryKey, type

### Community 35 - "CI Workflow & Readme"
Cohesion: 0.60
Nodes (5): Next.js, Vercel hosting, GitHub Actions CI (lint / typecheck / build), Post-deploy HTTP health check, Telegram CI failure notification

### Community 37 - "Drizzle Migration Journal"
Cohesion: 0.50
Nodes (3): dialect, entries, version

### Community 38 - "DB Migration Price Range Field"
Cohesion: 0.67
Nodes (3): price_range, name, columns

## Knowledge Gaps
- **406 isolated node(s):** `version`, `dialect`, `id`, `prevId`, `name` (+401 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `columns` connect `DB Migration Cancelled At Field` to `DB Migration Payments Columns`, `DB Migration Time Field`, `DB Migration Pricing Time Fields`, `DB Migration Restaurant Photos`, `DB Migration Reservations Foreign Keys`, `DB Migration Payment Required Field`, `DB Migration Payment Status Field`, `DB Migration Total Price Field`, `DB Migration City FK Field`, `DB Migration Confirmed At Field`, `DB Migration Date Field`, `DB Migration Guests Field`, `DB Migration Note Field`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `id` connect `DB Migration Restaurant Photos` to `DB Migration Payments Columns`, `DB Migration Cities Columns`, `DB Migration Pricing Time Fields`, `DB Migration Price Range Field`, `DB Migration Cancelled At Field`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `columns` connect `DB Migration Price Range Field` to `DB Migration Phone Field`, `DB Migration Photo URL Field`, `DB Migration Cities Columns`, `DB Migration Schema Constraints`, `DB Migration Restaurant Photos`, `DB Migration Rating Field`, `DB Migration Review Count Field`, `DB Migration Address Field`, `DB Migration City FK Field`, `DB Migration Cuisine Field`, `DB Migration Description Field`, `DB Migration Owner ID Field`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `version`, `dialect`, `id` to the rest of the system?**
  _406 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core App Pages & DB Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.08979591836734693 - nodes in this community are weakly interconnected._
- **Should `DB Migration Payments Columns` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `DB Migration Cities Columns` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._