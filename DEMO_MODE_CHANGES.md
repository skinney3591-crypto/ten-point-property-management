# Demo Mode Changes

This document lists all changes made to disable authentication for demo purposes.

## How to Revert

To restore authentication, undo all the changes listed below by uncommenting the auth checks and removing the `// TEMPORARILY DISABLED FOR DEMO` comments.

---

## Files Modified

### 1. `src/lib/supabase/middleware.ts`

**Changed:** Commented out the protected route redirects (lines 40-59)

**To revert:** Uncomment lines 40-59:
```typescript
// TEMPORARILY DISABLED FOR DEMO - Remove auth requirement
// Protected routes - redirect to login if not authenticated
// const isProtectedRoute = ...
// if (isProtectedRoute && !user) { ... }
// Redirect logged-in users away from login page
// if (request.nextUrl.pathname === '/login' && user) { ... }
```

---

### 2. `src/app/(dashboard)/page.tsx` (Dashboard)

**Changed:**
- Commented out `import { redirect } from 'next/navigation'`
- Commented out auth check block

**To revert:** Uncomment:
```typescript
import { redirect } from 'next/navigation'
// ...
const {
  data: { user },
} = await supabase.auth.getUser()

if (!user) {
  redirect('/login')
}
```

---

### 3. `src/app/(dashboard)/properties/page.tsx`

**Changed:** Same as above - commented out redirect import and auth check

**To revert:** Uncomment the redirect import and auth check block

---

### 4. `src/app/(dashboard)/properties/[id]/page.tsx`

**Changed:** Same as above - commented out redirect import and auth check

**To revert:** Uncomment the redirect import and auth check block

---

### 5. `src/app/(dashboard)/guests/page.tsx`

**Changed:** Same as above - commented out redirect import and auth check

**To revert:** Uncomment the redirect import and auth check block

---

### 6. `src/app/(dashboard)/guests/[id]/page.tsx`

**Changed:** Same as above - commented out redirect import and auth check

**To revert:** Uncomment the redirect import and auth check block

---

### 7. `src/app/(dashboard)/maintenance/page.tsx`

**Changed:** Same as above - commented out redirect import and auth check

**To revert:** Uncomment the redirect import and auth check block

---

### 8. `src/app/(dashboard)/financials/page.tsx`

**Changed:** Same as above - commented out redirect import and auth check

**To revert:** Uncomment the redirect import and auth check block

---

### 9. `src/app/(dashboard)/settings/page.tsx`

**Changed:**
- Commented out redirect import and auth check
- Changed Account tab to show "Demo Mode" and "Demo User" instead of `user.email` and `user.user_metadata?.name`

**To revert:**
1. Uncomment the redirect import and auth check block
2. Change the Account tab back to:
```tsx
<div>
  <p className="text-sm font-medium">Email</p>
  <p className="text-muted-foreground">{user.email}</p>
</div>
<div>
  <p className="text-sm font-medium">Name</p>
  <p className="text-muted-foreground">
    {user.user_metadata?.name || 'Not set'}
  </p>
</div>
```

---

### 10. `src/app/(dashboard)/inquiries/page.tsx`

**Changed:** Same as above - commented out redirect import and auth check

**To revert:** Uncomment the redirect import and auth check block

---

## Database Migration

**File:** `supabase/migration-remove-user-isolation.sql`

This migration was run to allow any authenticated user (or anonymous with anon key) to see all data.

**To revert:** You would need to recreate the original user-isolation RLS policies. The original policies were:
- Users can only view/edit their own data based on `user_id` column
- Each table had policies like "Users can view own properties" etc.

---

## Quick Revert Script

Search for `// TEMPORARILY DISABLED FOR DEMO` in the codebase to find all changes:

```bash
grep -r "TEMPORARILY DISABLED FOR DEMO" src/
```

---

## Git Commits for Demo Mode

The following commits contain the demo mode changes:

1. `2e93bb1` - Temporarily disable auth for demo (middleware + dashboard page)
2. `fe0298a` - Disable auth on all dashboard pages for demo

To fully revert, you can:
```bash
git revert fe0298a
git revert 2e93bb1
```

Or manually undo the changes listed above.
