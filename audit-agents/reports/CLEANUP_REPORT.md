# Cleanup Report
Generated: 2026-01-07T19:49:38.001Z

## Executive Summary

| Category | Count |
|----------|-------|
| Files Scanned | 114 |
| Unused Imports | 20 |
| Commented-Out Code | 31 |
| Duplicate Patterns | 1 |
| Potentially Unused Dependencies | 11 |
| TODO/FIXME Comments | 0 |

---

## Unused Imports


Found 20 unused imports that can be safely removed:

| File | Import | Line |
|------|--------|------|
| `src\app\(dashboard)\financials\page.tsx` | Home | - |
| `src\app\(dashboard)\properties\[id]\page.tsx` | RefreshCw | 5 |
| `src\app\(guest-portal)\portal\[token]\stays\page.tsx` | CardHeader | 5 |
| `src\app\(guest-portal)\portal\[token]\stays\page.tsx` | CardTitle | 5 |
| `src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx` | Key | - |
| `src\app\(public)\listings\[id]\page.tsx` | Badge | 7 |
| `src\app\api\ical-sync\route.ts` | determineBookingSource | - |
| `src\app\login\page.tsx` | useEffect | 3 |
| `src\components\financials\occupancy-stats.tsx` | isSameMonth | - |
| `src\components\financials\revenue-chart.tsx` | startOfMonth | - |
| `src\components\ui\badge.tsx` | type VariantProps | 3 |
| `src\components\ui\button.tsx` | type VariantProps | 3 |
| `src\components\ui\calendar.tsx` | type DayButton | - |
| `src\components\ui\form.tsx` | type ControllerProps | - |
| `src\components\ui\form.tsx` | type FieldPath | - |
| `src\components\ui\form.tsx` | type FieldValues | - |
| `src\components\ui\sonner.tsx` | type ToasterProps | 11 |
| `src\lib\supabase\middleware.ts` | type NextRequest | 2 |
| `src\lib\utils.ts` | type ClassValue | 1 |
| `src\middleware.ts` | type NextRequest | 1 |


### Quick Fix
Run ESLint with auto-fix to remove unused imports:
```bash
npm run lint -- --fix
```


---

## Commented-Out Code


Found 31 blocks of commented-out code that should be reviewed:


### CLEANUP-002: src\app\(dashboard)\financials\page.tsx
- **Line:** 35
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-003: src\app\(dashboard)\financials\page.tsx
- **Line:** 39
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-004: src\app\(dashboard)\financials\page.tsx
- **Line:** 2
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-005: src\app\(dashboard)\guests\page.tsx
- **Line:** 18
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-006: src\app\(dashboard)\guests\page.tsx
- **Line:** 22
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-007: src\app\(dashboard)\guests\page.tsx
- **Line:** 2
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-008: src\app\(dashboard)\guests\[id]\page.tsx
- **Line:** 49
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-009: src\app\(dashboard)\guests\[id]\page.tsx
- **Line:** 53
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-010: src\app\(dashboard)\guests\[id]\page.tsx
- **Line:** 3
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-011: src\app\(dashboard)\inquiries\page.tsx
- **Line:** 13
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-012: src\app\(dashboard)\inquiries\page.tsx
- **Line:** 17
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-013: src\app\(dashboard)\inquiries\page.tsx
- **Line:** 2
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-014: src\app\(dashboard)\maintenance\page.tsx
- **Line:** 17
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-015: src\app\(dashboard)\maintenance\page.tsx
- **Line:** 21
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-016: src\app\(dashboard)\maintenance\page.tsx
- **Line:** 2
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-017: src\app\(dashboard)\page.tsx
- **Line:** 12
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-018: src\app\(dashboard)\page.tsx
- **Line:** 16
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-019: src\app\(dashboard)\page.tsx
- **Line:** 2
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-020: src\app\(dashboard)\properties\page.tsx
- **Line:** 11
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-021: src\app\(dashboard)\properties\page.tsx
- **Line:** 15
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-022: src\app\(dashboard)\properties\page.tsx
- **Line:** 2
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-024: src\app\(dashboard)\properties\[id]\page.tsx
- **Line:** 24
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-025: src\app\(dashboard)\properties\[id]\page.tsx
- **Line:** 28
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-026: src\app\(dashboard)\properties\[id]\page.tsx
- **Line:** 3
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-027: src\app\(dashboard)\settings\page.tsx
- **Line:** 13
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// const {
//   data: { user },
// } = await supabase.auth.getUser()
```

---

### CLEANUP-028: src\app\(dashboard)\settings\page.tsx
- **Line:** 17
- **Description:** 3 lines of commented-out code
- **Action:** review

```typescript
// if (!user) {
//   redirect('/login')
// }
```

---

### CLEANUP-029: src\app\(dashboard)\settings\page.tsx
- **Line:** 2
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CLEANUP-046: src\lib\supabase\middleware.ts
- **Line:** 42
- **Description:** 5 lines of commented-out code
- **Action:** review

```typescript
// const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
//   request.nextUrl.pathname.startsWith('/properties') ||
//   request.nextUrl.pathname.startsWith('/guests') ||
...
```

---

### CLEANUP-047: src\lib\supabase\middleware.ts
- **Line:** 48
- **Description:** 5 lines of commented-out code
- **Action:** review

```typescript
// if (isProtectedRoute && !user) {
//   const url = request.nextUrl.clone()
//   url.pathname = '/login'
...
```

---

### CLEANUP-048: src\lib\supabase\middleware.ts
- **Line:** 55
- **Description:** 5 lines of commented-out code
- **Action:** review

```typescript
// if (request.nextUrl.pathname === '/login' && user) {
//   const url = request.nextUrl.clone()
//   url.pathname = '/'
...
```

---

### CLEANUP-049: src\lib\supabase\middleware.ts
- **Line:** 40
- **Description:** Demo mode: Authentication code disabled
- **Action:** review

```typescript
// TEMPORARILY DISABLED FOR DEMO - Remove auth requirement
```


### Known Demo Mode Changes
The following files have authentication disabled for demo purposes:
- src/app/(dashboard)/page.tsx
- src/app/(dashboard)/properties/page.tsx
- src/app/(dashboard)/guests/page.tsx
- src/app/(dashboard)/maintenance/page.tsx
- src/app/(dashboard)/financials/page.tsx
- src/app/(dashboard)/settings/page.tsx
- src/app/(dashboard)/inquiries/page.tsx

**To restore authentication:** See `DEMO_MODE_CHANGES.md` for revert instructions.


---

## Duplicate Code Patterns


Found 1 duplicate patterns that could be refactored:


### CLEANUP-052: Pattern "supabase-as-any" repeated in 44 files
- **Files:** src\app\(dashboard)\financials\page.tsx, src\app\(dashboard)\guests\page.tsx, src\app\(dashboard)\guests\[id]\page.tsx, src\app\(dashboard)\inquiries\page.tsx, src\app\(dashboard)\maintenance\page.tsx, src\app\(dashboard)\properties\page.tsx, src\app\(dashboard)\properties\[id]\page.tsx, src\app\(dashboard)\settings\page.tsx, src\app\(guest-portal)\portal\[token]\contact\page.tsx, src\app\(guest-portal)\portal\[token]\layout.tsx, src\app\(guest-portal)\portal\[token]\page.tsx, src\app\(guest-portal)\portal\[token]\rebook\page.tsx, src\app\(guest-portal)\portal\[token]\stays\page.tsx, src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx, src\app\(public)\listings\page.tsx, src\app\(public)\listings\[id]\page.tsx, src\app\api\auth\callback\route.ts, src\app\api\communications\send\route.ts, src\app\api\communications\send-template\route.ts, src\app\api\cron\send-scheduled-messages\route.ts, src\app\api\ical-sync\route.ts, src\app\api\inquiries\route.ts, src\app\api\portal\generate-link\route.ts, src\app\api\portal\verify\route.ts, src\components\bookings\booking-form-dialog.tsx, src\components\calendar\dashboard-calendar.tsx, src\components\dashboard\upcoming-tasks.tsx, src\components\financials\expense-form-dialog.tsx, src\components\financials\expenses-table.tsx, src\components\guests\edit-guest-dialog.tsx, src\components\guests\guest-actions.tsx, src\components\guests\guest-form-dialog.tsx, src\components\guests\guests-table.tsx, src\components\inquiries\inquiries-table.tsx, src\components\maintenance\edit-maintenance-dialog.tsx, src\components\maintenance\maintenance-form-dialog.tsx, src\components\maintenance\maintenance-table.tsx, src\components\properties\edit-property-dialog.tsx, src\components\properties\properties-table.tsx, src\components\properties\property-bookings-table.tsx, src\components\properties\property-form-dialog.tsx, src\components\settings\edit-vendor-dialog.tsx, src\components\settings\vendor-form-dialog.tsx, src\components\settings\vendors-table.tsx
- **Pattern:**
```typescript
await (supabase.from('table') as any)
```
- **Recommendation:** Create a shared utility function or typed helper


### Suggested Refactoring
Create a typed Supabase query helper:
```typescript
// src/lib/supabase/queries.ts
import { createClient } from './server';
import type { Database } from '@/types/database';

export async function query<T extends keyof Database['public']['Tables']>(
  table: T
) {
  const supabase = await createClient();
  return supabase.from(table);
}
```


---

## Potentially Unused Dependencies


The following dependencies may not be used (verify before removing):

| Package | Recommendation |
|---------|----------------|
| @hookform/resolvers | Review usage |
| react-dom | Review usage |
| zod | Review usage |
| @axe-core/playwright | Review usage |
| @playwright/test | Review usage |
| @tailwindcss/postcss | Review usage |
| concurrently | Review usage |
| eslint-config-next | Review usage |
| tailwindcss | Review usage |
| ts-node | Review usage |
| tw-animate-css | Review usage |

### Verify with depcheck
```bash
npx depcheck
```


---

## TODO/FIXME Comments

No TODO/FIXME comments found.

---

## Large Files (Consider Splitting)


The following files exceed 300 lines and may benefit from being split:

| File | Lines |
|------|-------|
| `src\types\database.ts` | 408 |
| `src\components\bookings\booking-form-dialog.tsx` | 393 |
| `src\components\calendar\dashboard-calendar.tsx` | 383 |
| `src\components\guests\send-message-dialog.tsx` | 345 |
| `src\components\maintenance\maintenance-form-dialog.tsx` | 323 |
| `src\app\(dashboard)\guests\[id]\page.tsx` | 306 |
| `src\components\maintenance\edit-maintenance-dialog.tsx` | 305 |
| `src\components\guests\guests-table.tsx` | 303 |


---

## Archive Recommendations

### Files Safe to Delete
Based on the analysis, these items can likely be removed:
1. Remove unused import in `src\app\(dashboard)\financials\page.tsx`
2. Remove unused import in `src\app\(dashboard)\properties\[id]\page.tsx`
3. Remove unused import in `src\app\(guest-portal)\portal\[token]\stays\page.tsx`
4. Remove unused import in `src\app\(guest-portal)\portal\[token]\stays\page.tsx`
5. Remove unused import in `src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx`
6. Remove unused import in `src\app\(public)\listings\[id]\page.tsx`
7. Remove unused import in `src\app\api\ical-sync\route.ts`
8. Remove unused import in `src\app\login\page.tsx`
9. Remove unused import in `src\components\financials\occupancy-stats.tsx`
10. Remove unused import in `src\components\financials\revenue-chart.tsx`

### Files to Review Before Archiving
1. `src\app\(dashboard)\financials\page.tsx` - 3 lines of commented-out code
2. `src\app\(dashboard)\financials\page.tsx` - 3 lines of commented-out code
3. `src\app\(dashboard)\financials\page.tsx` - Demo mode: Authentication code disabled
4. `src\app\(dashboard)\guests\page.tsx` - 3 lines of commented-out code
5. `src\app\(dashboard)\guests\page.tsx` - 3 lines of commented-out code
6. `src\app\(dashboard)\guests\page.tsx` - Demo mode: Authentication code disabled
7. `src\app\(dashboard)\guests\[id]\page.tsx` - 3 lines of commented-out code
8. `src\app\(dashboard)\guests\[id]\page.tsx` - 3 lines of commented-out code
9. `src\app\(dashboard)\guests\[id]\page.tsx` - Demo mode: Authentication code disabled
10. `src\app\(dashboard)\inquiries\page.tsx` - 3 lines of commented-out code
11. `src\app\(dashboard)\inquiries\page.tsx` - 3 lines of commented-out code
12. `src\app\(dashboard)\inquiries\page.tsx` - Demo mode: Authentication code disabled
13. `src\app\(dashboard)\maintenance\page.tsx` - 3 lines of commented-out code
14. `src\app\(dashboard)\maintenance\page.tsx` - 3 lines of commented-out code
15. `src\app\(dashboard)\maintenance\page.tsx` - Demo mode: Authentication code disabled
16. `src\app\(dashboard)\page.tsx` - 3 lines of commented-out code
17. `src\app\(dashboard)\page.tsx` - 3 lines of commented-out code
18. `src\app\(dashboard)\page.tsx` - Demo mode: Authentication code disabled
19. `src\app\(dashboard)\properties\page.tsx` - 3 lines of commented-out code
20. `src\app\(dashboard)\properties\page.tsx` - 3 lines of commented-out code
21. `src\app\(dashboard)\properties\page.tsx` - Demo mode: Authentication code disabled
22. `src\app\(dashboard)\properties\[id]\page.tsx` - 3 lines of commented-out code
23. `src\app\(dashboard)\properties\[id]\page.tsx` - 3 lines of commented-out code
24. `src\app\(dashboard)\properties\[id]\page.tsx` - Demo mode: Authentication code disabled
25. `src\app\(dashboard)\settings\page.tsx` - 3 lines of commented-out code
26. `src\app\(dashboard)\settings\page.tsx` - 3 lines of commented-out code
27. `src\app\(dashboard)\settings\page.tsx` - Demo mode: Authentication code disabled
28. `src\lib\supabase\middleware.ts` - 5 lines of commented-out code
29. `src\lib\supabase\middleware.ts` - 5 lines of commented-out code
30. `src\lib\supabase\middleware.ts` - 5 lines of commented-out code
31. `src\lib\supabase\middleware.ts` - Demo mode: Authentication code disabled

### SQL Migration Files
Consider archiving old migration files in `supabase/`:
- migration-phase9.sql (if already applied)
- migration-remove-user-isolation.sql (if already applied)

---

## Actionable Commands

### Remove Unused Imports
```bash
# Using ESLint
npm run lint -- --fix

# Or manually with VS Code
# Install "Organize Imports" extension and run on save
```

### Check for Unused Dependencies
```bash
npx depcheck
```

### Find All TODOs
```bash
grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx"
```

### Run Security Audit
```bash
npm audit
npm audit fix
```

---

## Summary

This cleanup report identifies opportunities to improve code quality by:
1. Removing 20 unused imports
2. Reviewing 31 blocks of commented-out code
3. Refactoring 1 duplicate patterns
4. Addressing 0 TODO comments
5. Considering splitting 8 large files

**Estimated cleanup impact:** Reducing technical debt and improving maintainability.
