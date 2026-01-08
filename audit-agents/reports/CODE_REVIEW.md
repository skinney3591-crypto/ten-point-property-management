# Code Review Report
Generated: 2026-01-07T19:49:35.730Z

## Executive Summary

| Metric | Count |
|--------|-------|
| Files Analyzed | 114 |
| Total Issues | 137 |
| Critical Issues | 11 |
| High Issues | 0 |

## Issues by Category

| Category | Count |
|----------|-------|
| Security | 11 |
| TypeScript | 82 |
| Performance | 18 |
| Best Practices | 3 |
| Accessibility | 23 |

---

## Critical Issues (Fix Immediately)


### CODE-002: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\financials\page.tsx` (line 2)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-006: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\guests\page.tsx` (line 2)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-009: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\guests\[id]\page.tsx` (line 3)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-014: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\inquiries\page.tsx` (line 2)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-016: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\maintenance\page.tsx` (line 2)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-020: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\page.tsx` (line 2)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-021: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\properties\page.tsx` (line 2)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-024: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\properties\[id]\page.tsx` (line 3)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-029: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\app\(dashboard)\settings\page.tsx` (line 2)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
```

---

### CODE-114: Potential hardcoded secret
- **Category:** security
- **File:** `src\components\portal\check-in-instructions.tsx` (line 48)
- **Description:** Possible hardcoded secret found. Secrets should be stored in environment variables.
- **Recommendation:** Move secret to .env file and reference via process.env


---

### CODE-137: Authentication disabled for demo mode
- **Category:** security
- **File:** `src\lib\supabase\middleware.ts` (line 40)
- **Description:** Authentication checks have been commented out, allowing unauthenticated access to protected routes.
- **Recommendation:** Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

```typescript
// TEMPORARILY DISABLED FOR DEMO - Remove auth requirement
```


---

## High Priority Issues

No high priority issues found.

---

## Security Analysis

### Authentication Status
**WARNING:** Authentication is currently DISABLED for demo mode. Re-enable before production!

### API Input Validation
API routes appear to have validation.

### XSS Prevention
No obvious XSS vulnerabilities detected.

---

## TypeScript Quality

### Type Safety Issues

- **src\app\(dashboard)\financials\page.tsx**: Type assertion 'as any' used (3 occurrences)

- **src\app\(dashboard)\guests\page.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\app\(dashboard)\guests\[id]\page.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\app\(dashboard)\inquiries\page.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\app\(dashboard)\maintenance\page.tsx**: Type assertion 'as any' used (3 occurrences)

- **src\app\(dashboard)\properties\page.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\app\(dashboard)\properties\[id]\page.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\app\(dashboard)\settings\page.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\app\(guest-portal)\portal\[token]\contact\page.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\app\(guest-portal)\portal\[token]\layout.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\app\(guest-portal)\portal\[token]\page.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\app\(guest-portal)\portal\[token]\rebook\page.tsx**: Type assertion 'as any' used (3 occurrences)

- **src\app\(guest-portal)\portal\[token]\stays\page.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\app\(public)\listings\page.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\app\(public)\listings\[id]\page.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\app\api\auth\callback\route.ts**: Type assertion 'as any' used (1 occurrences)

- **src\app\api\communications\send\route.ts**: Type assertion 'as any' used (2 occurrences)

- **src\app\api\communications\send-template\route.ts**: Type assertion 'as any' used (4 occurrences)

- **src\app\api\cron\send-scheduled-messages\route.ts**: Type assertion 'as any' used (7 occurrences)

- **src\app\api\ical-sync\route.ts**: Type assertion 'as any' used (3 occurrences)

- **src\app\api\inquiries\route.ts**: Type assertion 'as any' used (1 occurrences)

- **src\app\api\portal\generate-link\route.ts**: Type assertion 'as any' used (2 occurrences)

- **src\app\api\portal\verify\route.ts**: Type assertion 'as any' used (1 occurrences)

- **src\components\bookings\booking-form-dialog.tsx**: Type assertion 'as any' used (3 occurrences)

- **src\components\calendar\dashboard-calendar.tsx**: Type assertion 'as any' used (3 occurrences)

- **src\components\dashboard\upcoming-tasks.tsx**: Type assertion 'as any' used (3 occurrences)

- **src\components\financials\expense-form-dialog.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\components\financials\expenses-table.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\guests\edit-guest-dialog.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\guests\guest-actions.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\guests\guest-form-dialog.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\guests\guests-table.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\inquiries\inquiries-table.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\maintenance\edit-maintenance-dialog.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\maintenance\maintenance-form-dialog.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\maintenance\maintenance-table.tsx**: Type assertion 'as any' used (2 occurrences)

- **src\components\properties\edit-property-dialog.tsx**: Type assertion 'as any' used (4 occurrences)

- **src\components\properties\properties-table.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\properties\property-bookings-table.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\properties\property-form-dialog.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\settings\edit-vendor-dialog.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\settings\vendor-form-dialog.tsx**: Type assertion 'as any' used (1 occurrences)

- **src\components\settings\vendors-table.tsx**: Type assertion 'as any' used (1 occurrences)


### ESLint Compliance
Found 38 files with disabled ESLint rules.

---

## Performance Observations


- **src\app\(dashboard)\financials\page.tsx**: Found 5 await statements. Consider using Promise.all for independent operations.


- **src\app\(dashboard)\guests\[id]\page.tsx**: Found 4 await statements. Consider using Promise.all for independent operations.


- **src\app\(dashboard)\maintenance\page.tsx**: Found 5 await statements. Consider using Promise.all for independent operations.


- **src\app\(dashboard)\properties\[id]\page.tsx**: Found 5 await statements. Consider using Promise.all for independent operations.


- **src\app\(guest-portal)\portal\[token]\page.tsx**: Found 4 await statements. Consider using Promise.all for independent operations.


- **src\app\(guest-portal)\portal\[token]\rebook\page.tsx**: Found 4 await statements. Consider using Promise.all for independent operations.


- **src\app\(guest-portal)\portal\[token]\stays\page.tsx**: Found 4 await statements. Consider using Promise.all for independent operations.


- **src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx**: Found 4 await statements. Consider using Promise.all for independent operations.


- **src\app\(public)\listings\[id]\page.tsx**: Found 7 await statements. Consider using Promise.all for independent operations.


- **src\app\api\auth\callback\route.ts**: Found 5 await statements. Consider using Promise.all for independent operations.


- **src\app\api\communications\send\route.ts**: Found 7 await statements. Consider using Promise.all for independent operations.


- **src\app\api\communications\send-template\route.ts**: Found 9 await statements. Consider using Promise.all for independent operations.


- **src\app\api\cron\send-scheduled-messages\route.ts**: Found 15 await statements. Consider using Promise.all for independent operations.


- **src\app\api\ical-sync\route.ts**: Found 7 await statements. Consider using Promise.all for independent operations.


- **src\app\api\inquiries\route.ts**: Found 4 await statements. Consider using Promise.all for independent operations.


- **src\app\api\portal\generate-link\route.ts**: Found 5 await statements. Consider using Promise.all for independent operations.


- **src\components\bookings\booking-form-dialog.tsx**: Found 4 await statements. Consider using Promise.all for independent operations.


- **src\components\guests\send-message-dialog.tsx**: Found 6 await statements. Consider using Promise.all for independent operations.


### Recommendations
1. Use Promise.all for parallel data fetching
2. Move inline styles to Tailwind classes
3. Consider React.memo for frequently re-rendered components

---

## Best Practices Review

### Good Patterns Found
- ✅ Uses shadcn/ui component library for consistent UI
- ✅ Implements Supabase Row-Level Security (RLS)
- ✅ Uses React Hook Form for form state management

### Areas for Improvement
- ⚠️ Console.log statement in production code (src\components\calendar\dashboard-calendar.tsx)
- ⚠️ Console.log statement in production code (src\lib\email.ts)
- ⚠️ Console.log statement in production code (src\lib\sms.ts)

---

## Accessibility in Code


- **src\app\(dashboard)\error.tsx**: Found buttons that may contain only icons without accessible text.


- **src\app\(dashboard)\guests\[id]\page.tsx**: Found buttons that may contain only icons without accessible text.


- **src\app\(dashboard)\properties\[id]\page.tsx**: Found buttons that may contain only icons without accessible text.


- **src\app\(guest-portal)\portal\[token]\not-found.tsx**: Found buttons that may contain only icons without accessible text.


- **src\app\(guest-portal)\portal\[token]\page.tsx**: Found buttons that may contain only icons without accessible text.


- **src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx**: Found buttons that may contain only icons without accessible text.


- **src\app\not-found.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\financials\expenses-table.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\guests\generate-portal-link.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\guests\guest-actions.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\guests\guest-search.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\guests\guests-table.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\inquiries\inquiries-table.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\maintenance\maintenance-table.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\navigation\header.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\navigation\mobile-nav.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\navigation\sidebar.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\properties\properties-table.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\properties\property-bookings-table.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\properties\sync-calendar-button.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\public\availability-calendar.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\public\property-gallery.tsx**: Found buttons that may contain only icons without accessible text.


- **src\components\settings\vendors-table.tsx**: Found buttons that may contain only icons without accessible text.


---

## Medium Priority Issues

1. **CODE-001**: Button may be missing accessible name - `src\app\(dashboard)\error.tsx`
2. **CODE-003**: Type assertion 'as any' used (3 occurrences) - `src\app\(dashboard)\financials\page.tsx`
3. **CODE-007**: Type assertion 'as any' used (1 occurrences) - `src\app\(dashboard)\guests\page.tsx`
4. **CODE-010**: Type assertion 'as any' used (1 occurrences) - `src\app\(dashboard)\guests\[id]\page.tsx`
5. **CODE-013**: Button may be missing accessible name - `src\app\(dashboard)\guests\[id]\page.tsx`
6. **CODE-015**: Type assertion 'as any' used (1 occurrences) - `src\app\(dashboard)\inquiries\page.tsx`
7. **CODE-017**: Type assertion 'as any' used (3 occurrences) - `src\app\(dashboard)\maintenance\page.tsx`
8. **CODE-022**: Type assertion 'as any' used (1 occurrences) - `src\app\(dashboard)\properties\page.tsx`
9. **CODE-025**: Type assertion 'as any' used (2 occurrences) - `src\app\(dashboard)\properties\[id]\page.tsx`
10. **CODE-028**: Button may be missing accessible name - `src\app\(dashboard)\properties\[id]\page.tsx`
11. **CODE-030**: Type assertion 'as any' used (1 occurrences) - `src\app\(dashboard)\settings\page.tsx`
12. **CODE-032**: Type assertion 'as any' used (2 occurrences) - `src\app\(guest-portal)\portal\[token]\contact\page.tsx`
13. **CODE-034**: Type assertion 'as any' used (1 occurrences) - `src\app\(guest-portal)\portal\[token]\layout.tsx`
14. **CODE-036**: Button may be missing accessible name - `src\app\(guest-portal)\portal\[token]\not-found.tsx`
15. **CODE-037**: Type assertion 'as any' used (2 occurrences) - `src\app\(guest-portal)\portal\[token]\page.tsx`
16. **CODE-040**: Button may be missing accessible name - `src\app\(guest-portal)\portal\[token]\page.tsx`
17. **CODE-041**: Type assertion 'as any' used (3 occurrences) - `src\app\(guest-portal)\portal\[token]\rebook\page.tsx`
18. **CODE-044**: Type assertion 'as any' used (2 occurrences) - `src\app\(guest-portal)\portal\[token]\stays\page.tsx`
19. **CODE-047**: Type assertion 'as any' used (2 occurrences) - `src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx`
20. **CODE-050**: Button may be missing accessible name - `src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx`
21. **CODE-051**: Type assertion 'as any' used (1 occurrences) - `src\app\(public)\listings\page.tsx`
22. **CODE-052**: Type assertion 'as any' used (2 occurrences) - `src\app\(public)\listings\[id]\page.tsx`
23. **CODE-054**: Type assertion 'as any' used (1 occurrences) - `src\app\api\auth\callback\route.ts`
24. **CODE-057**: Type assertion 'as any' used (2 occurrences) - `src\app\api\communications\send\route.ts`
25. **CODE-060**: Type assertion 'as any' used (4 occurrences) - `src\app\api\communications\send-template\route.ts`
26. **CODE-063**: Type assertion 'as any' used (7 occurrences) - `src\app\api\cron\send-scheduled-messages\route.ts`
27. **CODE-066**: Type assertion 'as any' used (3 occurrences) - `src\app\api\ical-sync\route.ts`
28. **CODE-069**: Type assertion 'as any' used (1 occurrences) - `src\app\api\inquiries\route.ts`
29. **CODE-071**: Type assertion 'as any' used (2 occurrences) - `src\app\api\portal\generate-link\route.ts`
30. **CODE-074**: Type assertion 'as any' used (1 occurrences) - `src\app\api\portal\verify\route.ts`
31. **CODE-076**: Button may be missing accessible name - `src\app\not-found.tsx`
32. **CODE-077**: Type assertion 'as any' used (3 occurrences) - `src\components\bookings\booking-form-dialog.tsx`
33. **CODE-080**: Type assertion 'as any' used (3 occurrences) - `src\components\calendar\dashboard-calendar.tsx`
34. **CODE-083**: Type assertion 'as any' used (3 occurrences) - `src\components\dashboard\upcoming-tasks.tsx`
35. **CODE-084**: Type assertion 'as any' used (2 occurrences) - `src\components\financials\expense-form-dialog.tsx`
36. **CODE-086**: Type assertion 'as any' used (1 occurrences) - `src\components\financials\expenses-table.tsx`
37. **CODE-088**: Button may be missing accessible name - `src\components\financials\expenses-table.tsx`
38. **CODE-089**: Type assertion 'as any' used (1 occurrences) - `src\components\guests\edit-guest-dialog.tsx`
39. **CODE-091**: Button may be missing accessible name - `src\components\guests\generate-portal-link.tsx`
40. **CODE-092**: Type assertion 'as any' used (1 occurrences) - `src\components\guests\guest-actions.tsx`
41. **CODE-094**: Button may be missing accessible name - `src\components\guests\guest-actions.tsx`
42. **CODE-095**: Type assertion 'as any' used (1 occurrences) - `src\components\guests\guest-form-dialog.tsx`
43. **CODE-097**: Button may be missing accessible name - `src\components\guests\guest-search.tsx`
44. **CODE-098**: Type assertion 'as any' used (1 occurrences) - `src\components\guests\guests-table.tsx`
45. **CODE-100**: Button may be missing accessible name - `src\components\guests\guests-table.tsx`
46. **CODE-102**: Type assertion 'as any' used (1 occurrences) - `src\components\inquiries\inquiries-table.tsx`
47. **CODE-103**: Button may be missing accessible name - `src\components\inquiries\inquiries-table.tsx`
48. **CODE-104**: Type assertion 'as any' used (1 occurrences) - `src\components\maintenance\edit-maintenance-dialog.tsx`
49. **CODE-106**: Type assertion 'as any' used (1 occurrences) - `src\components\maintenance\maintenance-form-dialog.tsx`
50. **CODE-108**: Type assertion 'as any' used (2 occurrences) - `src\components\maintenance\maintenance-table.tsx`
51. **CODE-110**: Button may be missing accessible name - `src\components\maintenance\maintenance-table.tsx`
52. **CODE-111**: Button may be missing accessible name - `src\components\navigation\header.tsx`
53. **CODE-112**: Button may be missing accessible name - `src\components\navigation\mobile-nav.tsx`
54. **CODE-113**: Button may be missing accessible name - `src\components\navigation\sidebar.tsx`
55. **CODE-115**: Type assertion 'as any' used (4 occurrences) - `src\components\properties\edit-property-dialog.tsx`
56. **CODE-117**: Type assertion 'as any' used (1 occurrences) - `src\components\properties\properties-table.tsx`
57. **CODE-119**: Button may be missing accessible name - `src\components\properties\properties-table.tsx`
58. **CODE-120**: Type assertion 'as any' used (1 occurrences) - `src\components\properties\property-bookings-table.tsx`
59. **CODE-122**: Button may be missing accessible name - `src\components\properties\property-bookings-table.tsx`
60. **CODE-123**: Type assertion 'as any' used (1 occurrences) - `src\components\properties\property-form-dialog.tsx`
61. **CODE-125**: Button may be missing accessible name - `src\components\properties\sync-calendar-button.tsx`
62. **CODE-126**: Button may be missing accessible name - `src\components\public\availability-calendar.tsx`
63. **CODE-127**: Button may be missing accessible name - `src\components\public\property-gallery.tsx`
64. **CODE-128**: Type assertion 'as any' used (1 occurrences) - `src\components\settings\edit-vendor-dialog.tsx`
65. **CODE-130**: Type assertion 'as any' used (1 occurrences) - `src\components\settings\vendor-form-dialog.tsx`
66. **CODE-132**: Type assertion 'as any' used (1 occurrences) - `src\components\settings\vendors-table.tsx`
67. **CODE-134**: Button may be missing accessible name - `src\components\settings\vendors-table.tsx`

---

## Low Priority Issues

1. **CODE-004**: ESLint rules disabled - `src\app\(dashboard)\financials\page.tsx`
2. **CODE-005**: Multiple sequential awaits without Promise.all - `src\app\(dashboard)\financials\page.tsx`
3. **CODE-008**: ESLint rules disabled - `src\app\(dashboard)\guests\page.tsx`
4. **CODE-011**: ESLint rules disabled - `src\app\(dashboard)\guests\[id]\page.tsx`
5. **CODE-012**: Multiple sequential awaits without Promise.all - `src\app\(dashboard)\guests\[id]\page.tsx`
6. **CODE-018**: ESLint rules disabled - `src\app\(dashboard)\maintenance\page.tsx`
7. **CODE-019**: Multiple sequential awaits without Promise.all - `src\app\(dashboard)\maintenance\page.tsx`
8. **CODE-023**: ESLint rules disabled - `src\app\(dashboard)\properties\page.tsx`
9. **CODE-026**: ESLint rules disabled - `src\app\(dashboard)\properties\[id]\page.tsx`
10. **CODE-027**: Multiple sequential awaits without Promise.all - `src\app\(dashboard)\properties\[id]\page.tsx`
11. **CODE-031**: ESLint rules disabled - `src\app\(dashboard)\settings\page.tsx`
12. **CODE-033**: ESLint rules disabled - `src\app\(guest-portal)\portal\[token]\contact\page.tsx`
13. **CODE-035**: ESLint rules disabled - `src\app\(guest-portal)\portal\[token]\layout.tsx`
14. **CODE-038**: ESLint rules disabled - `src\app\(guest-portal)\portal\[token]\page.tsx`
15. **CODE-039**: Multiple sequential awaits without Promise.all - `src\app\(guest-portal)\portal\[token]\page.tsx`
16. **CODE-042**: ESLint rules disabled - `src\app\(guest-portal)\portal\[token]\rebook\page.tsx`
17. **CODE-043**: Multiple sequential awaits without Promise.all - `src\app\(guest-portal)\portal\[token]\rebook\page.tsx`
18. **CODE-045**: ESLint rules disabled - `src\app\(guest-portal)\portal\[token]\stays\page.tsx`
19. **CODE-046**: Multiple sequential awaits without Promise.all - `src\app\(guest-portal)\portal\[token]\stays\page.tsx`
20. **CODE-048**: ESLint rules disabled - `src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx`
21. **CODE-049**: Multiple sequential awaits without Promise.all - `src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx`
22. **CODE-053**: Multiple sequential awaits without Promise.all - `src\app\(public)\listings\[id]\page.tsx`
23. **CODE-055**: ESLint rules disabled - `src\app\api\auth\callback\route.ts`
24. **CODE-056**: Multiple sequential awaits without Promise.all - `src\app\api\auth\callback\route.ts`
25. **CODE-058**: ESLint rules disabled - `src\app\api\communications\send\route.ts`
26. **CODE-059**: Multiple sequential awaits without Promise.all - `src\app\api\communications\send\route.ts`
27. **CODE-061**: ESLint rules disabled - `src\app\api\communications\send-template\route.ts`
28. **CODE-062**: Multiple sequential awaits without Promise.all - `src\app\api\communications\send-template\route.ts`
29. **CODE-064**: ESLint rules disabled - `src\app\api\cron\send-scheduled-messages\route.ts`
30. **CODE-065**: Multiple sequential awaits without Promise.all - `src\app\api\cron\send-scheduled-messages\route.ts`
31. **CODE-067**: ESLint rules disabled - `src\app\api\ical-sync\route.ts`
32. **CODE-068**: Multiple sequential awaits without Promise.all - `src\app\api\ical-sync\route.ts`
33. **CODE-070**: Multiple sequential awaits without Promise.all - `src\app\api\inquiries\route.ts`
34. **CODE-072**: ESLint rules disabled - `src\app\api\portal\generate-link\route.ts`
35. **CODE-073**: Multiple sequential awaits without Promise.all - `src\app\api\portal\generate-link\route.ts`
36. **CODE-075**: ESLint rules disabled - `src\app\api\portal\verify\route.ts`
37. **CODE-078**: ESLint rules disabled - `src\components\bookings\booking-form-dialog.tsx`
38. **CODE-079**: Multiple sequential awaits without Promise.all - `src\components\bookings\booking-form-dialog.tsx`
39. **CODE-081**: ESLint rules disabled - `src\components\calendar\dashboard-calendar.tsx`
40. **CODE-082**: Console.log statement in production code - `src\components\calendar\dashboard-calendar.tsx`
41. **CODE-085**: ESLint rules disabled - `src\components\financials\expense-form-dialog.tsx`
42. **CODE-087**: ESLint rules disabled - `src\components\financials\expenses-table.tsx`
43. **CODE-090**: ESLint rules disabled - `src\components\guests\edit-guest-dialog.tsx`
44. **CODE-093**: ESLint rules disabled - `src\components\guests\guest-actions.tsx`
45. **CODE-096**: ESLint rules disabled - `src\components\guests\guest-form-dialog.tsx`
46. **CODE-099**: ESLint rules disabled - `src\components\guests\guests-table.tsx`
47. **CODE-101**: Multiple sequential awaits without Promise.all - `src\components\guests\send-message-dialog.tsx`
48. **CODE-105**: ESLint rules disabled - `src\components\maintenance\edit-maintenance-dialog.tsx`
49. **CODE-107**: ESLint rules disabled - `src\components\maintenance\maintenance-form-dialog.tsx`
50. **CODE-109**: ESLint rules disabled - `src\components\maintenance\maintenance-table.tsx`
51. **CODE-116**: ESLint rules disabled - `src\components\properties\edit-property-dialog.tsx`
52. **CODE-118**: ESLint rules disabled - `src\components\properties\properties-table.tsx`
53. **CODE-121**: ESLint rules disabled - `src\components\properties\property-bookings-table.tsx`
54. **CODE-124**: ESLint rules disabled - `src\components\properties\property-form-dialog.tsx`
55. **CODE-129**: ESLint rules disabled - `src\components\settings\edit-vendor-dialog.tsx`
56. **CODE-131**: ESLint rules disabled - `src\components\settings\vendor-form-dialog.tsx`
57. **CODE-133**: ESLint rules disabled - `src\components\settings\vendors-table.tsx`
58. **CODE-135**: Console.log statement in production code - `src\lib\email.ts`
59. **CODE-136**: Console.log statement in production code - `src\lib\sms.ts`

---

## Recommendations by Priority

### P0 - Critical (Fix Immediately)
1. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
2. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
3. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
4. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
5. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
6. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
7. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
8. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
9. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.
10. Move secret to .env file and reference via process.env
11. Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.

### P1 - High (Fix Soon)
None

### P2 - Medium (Planned Improvement)
1. Add aria-label or visually hidden text for icon-only buttons
2. Create proper type definitions or use type guards
3. Create proper type definitions or use type guards
4. Create proper type definitions or use type guards
5. Add aria-label or visually hidden text for icon-only buttons

### P3 - Low (Nice to Have)
1. Fix the underlying issue instead of disabling the rule
2. Use Promise.all for parallel data fetching when operations are independent
3. Fix the underlying issue instead of disabling the rule
4. Fix the underlying issue instead of disabling the rule
5. Use Promise.all for parallel data fetching when operations are independent

---

## Files with Most Issues

| File | Issues |
|------|--------|
| src\app\(dashboard)\guests\[id]\page.tsx | 5 |
| src\app\(dashboard)\properties\[id]\page.tsx | 5 |
| src\app\(dashboard)\financials\page.tsx | 4 |
| src\app\(dashboard)\maintenance\page.tsx | 4 |
| src\app\(guest-portal)\portal\[token]\page.tsx | 4 |
| src\app\(guest-portal)\portal\[token]\stays\[bookingId]\page.tsx | 4 |
| src\app\(dashboard)\guests\page.tsx | 3 |
| src\app\(dashboard)\properties\page.tsx | 3 |
| src\app\(dashboard)\settings\page.tsx | 3 |
| src\app\(guest-portal)\portal\[token]\rebook\page.tsx | 3 |

---

## Testing Methodology

This code review was conducted using static analysis of:
- All TypeScript/TSX files in the src/ directory
- Security pattern detection
- TypeScript quality checks
- Performance anti-pattern detection
- Accessibility best practices in JSX
