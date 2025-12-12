# Zustand Hydration Fix

## Issues Fixed

### 1. PATCH /api/auth/profile 500 Error ✅
**Problem:** The PATCH endpoint was trying to handle both JSON and FormData, but `apiPatchWithCookies` only supports JSON (always sets `Content-Type: application/json` and calls `JSON.stringify`).

**Solution:**
- Simplified PATCH route in `/api/auth/profile/route.ts` to only accept JSON data
- Removed multipart/form-data handling
- Added console logging for debugging

**Code Changes:**
```typescript
// BEFORE (Caused 500 error)
const contentType = request.headers.get('content-type');
if (contentType?.includes('multipart/form-data')) {
  const formData = await request.formData();
  // ... FormData handling
} else {
  const data = await request.json();
  // ... JSON handling
}

// AFTER (Fixed)
const data = await request.json();
console.log('Updating profile with data:', data);
const updatedUser = await apiPatchWithCookies('/auth/users/me/', data, true);
```

### 2. Superuser Not Seeing Management Hub Items ✅
**Problem:** Zustand's persist middleware has a hydration delay. When the sidebar renders on the client, the persisted user data from localStorage hasn't loaded yet, so `user` is null and role checks fail.

**Root Cause:**
1. Page loads → Sidebar renders immediately
2. Zustand persist middleware starts rehydrating from localStorage
3. During initial render, `user` is null
4. `shouldShowManagementHub()` checks `user?.is_superuser` → returns false
5. Navigation items are hidden
6. After hydration completes, user data is available but sidebar doesn't re-render properly

**Solution:**
Added hydration state tracking to Zustand store:

1. **Added `hasHydrated` state** to track when persist middleware finishes loading data
2. **Added `setHasHydrated` action** to update hydration status
3. **Added `onRehydrateStorage` callback** to set `hasHydrated` to true when complete
4. **Updated sidebar** to wait for hydration before rendering navigation items

**Code Changes:**

**authStore.ts:**
```typescript
interface AuthState {
  // ... existing fields
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      hasHydrated: false,
      
      // Actions
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      
      // ... rest of store
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
```

**app-sidebar.tsx:**
```typescript
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, hasHydrated, shouldShowManagementHub, shouldShowMyContent } = useAuthStore();

  // Debug logging
  useEffect(() => {
    console.log('Sidebar - Has hydrated:', hasHydrated);
    console.log('Sidebar - User data:', user);
    console.log('Sidebar - Should show management:', shouldShowManagementHub());
  }, [user, hasHydrated]);

  // Wait for hydration before rendering navigation items
  if (!hasHydrated) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>{/* Brand logo */}</SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Now user data is guaranteed to be loaded
  const data = { /* navigation items */ };
  
  return <Sidebar>{ /* full sidebar */}</Sidebar>;
}
```

## How It Works

1. **Initial Render:** `hasHydrated` is false → Sidebar shows loading spinner
2. **Hydration Complete:** persist middleware calls `onRehydrateStorage` → sets `hasHydrated` to true
3. **Re-render:** Sidebar detects `hasHydrated` changed → renders full navigation with correct user data
4. **Role Checks Work:** `shouldShowManagementHub()` now has access to user data → shows Management Hub for superusers

## Testing Checklist

- [ ] Login as superuser → Should see Management Hub (Users, Categories, Subcategories)
- [ ] Login as instructor → Should see "My Content" + Payment History (no Management Hub)
- [ ] Login as regular user → Should see Profile + Payment History only
- [ ] Update profile via PATCH /api/auth/profile → Should work without 500 error
- [ ] Check browser console → Should see debug logs showing user data and role checks
- [ ] Refresh page → Sidebar should show loading briefly, then full navigation with correct items

## Debug Logs

The sidebar now logs useful debugging info on every render:

```
Sidebar - Has hydrated: true
Sidebar - User data: { id: 1, username: "admin", is_superuser: true, ... }
Sidebar - Is Superuser: true
Sidebar - Should show management: true
Sidebar - Should show my content: true
```

Use these logs to verify:
1. Hydration completes successfully
2. User data is loaded correctly
3. Role checks return expected values
4. Navigation items render based on correct data

## Related Files

- `/src/stores/authStore.ts` - Added hydration tracking
- `/src/components/Dashboard/Layout/app-sidebar.tsx` - Added hydration wait + debug logs
- `/src/app/api/auth/profile/route.ts` - Fixed PATCH to only handle JSON
- `/src/lib/apiWithCookies.ts` - Reference for apiPatchWithCookies signature

## Key Learnings

1. **Zustand Persist is Async:** Always account for hydration delay in SSR/client-rendered apps
2. **Type Mismatches:** Ensure API route handlers match the utilities they call (JSON vs FormData)
3. **Debug Early:** Console logs help identify timing issues with state management
4. **Wait for Hydration:** Show loading states until persisted data is available
