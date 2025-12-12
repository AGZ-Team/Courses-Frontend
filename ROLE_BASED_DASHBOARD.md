# Role-Based Dashboard Access

## Problem
The backend endpoint `GET /auth/users/me/` does **not** return `is_superuser` and `is_instructor` fields. It only returns:
- first_name, last_name, email, phone, bio, area_of_expertise
- picture, username, id_card_face, id_card_back

Without these role flags, the dashboard couldn't determine what menu items to show for each user.

## Solution

### 1. **Role Derivation in `useUserProfile.ts`**

When fetching the user profile, we derive missing role flags:

```typescript
// Infer is_instructor from profile fields
if (!derived.is_instructor && (profile.area_of_expertise || profile.id_card_face || profile.id_card_back)) {
  derived.is_instructor = true;
}

// Infer is_superuser by testing admin API access
if (!derived.is_superuser) {
  try {
    const adminResp = await fetch('/api/admin/users', {
      method: 'GET',
      credentials: 'include',
    });

    if (adminResp.ok) {
      derived.is_superuser = true;  // User can access admin API
    }
  } catch (adminError) {
    // Leave is_superuser = false
  }
}
```

### 2. **Zustand Store Role Helpers**

In `authStore.ts`, we have helper methods that check role flags:

```typescript
shouldShowManagementHub: () => {
  const { user } = get();
  return user?.is_superuser === true;  // Only superusers
}

shouldShowMyContent: () => {
  const { user } = get();
  return user?.is_instructor === true || user?.is_superuser === true;
}

shouldShowIdCards: () => {
  const { user } = get();
  return user?.is_instructor === true || user?.is_superuser === true;
}
```

### 3. **Sidebar Navigation Rules**

The sidebar in `app-sidebar.tsx` renders different menu sections based on roles:

```typescript
// All users see these
navMain: [Dashboard, Profile]

// Only superusers see Management Hub
managementHub: shouldShowManagementHub() ? [Users, Categories, Subcategories] : []

// Instructors and superusers see My Content
myContent: shouldShowMyContent() ? [My Content] : []

// All users see Payment History
payments: [Payment History]
```

## Expected Dashboard Views

### Normal User (is_superuser=false, is_instructor=false)
- Dashboard
- Profile
- Payment History

### Influencer (is_superuser=false, is_instructor=true)
- Dashboard
- Profile
- **My Content** ← Shows instructor panels
- Payment History

### Superuser (is_superuser=true)
- Dashboard
- Profile
- **Management Hub** ← Users, Categories, Subcategories
- **My Content** ← Instructor content if is_instructor=true
- Payment History

## Debug Information

The sidebar logs detailed role information on mount:

```javascript
{
  username: "admin",
  is_superuser: true,
  is_instructor: false,
  isSuperuser: true,
  isInstructor: false,
  shouldShowManagementHub: true,
  shouldShowMyContent: false,
}
```

Check browser console to verify:
1. User data is loaded
2. Role flags are correct
3. Navigation rules evaluated properly

## Files Modified

1. **`src/hooks/useUserProfile.ts`**
   - Added role derivation logic
   - Infers `is_instructor` from profile fields
   - Tests admin API to detect superuser access
   - Logs role detection for debugging

2. **`src/components/Dashboard/Layout/app-sidebar.tsx`**
   - Simplified hydration logic
   - Uses role helper methods to conditionally render menu sections
   - Added debug logging for role checks

3. **`src/stores/authStore.ts`** (existing)
   - Unchanged - already has helper methods

## Testing Checklist

- [ ] **Login as superuser**: Should see Management Hub + My Content (if instructor)
- [ ] **Login as influencer**: Should see My Content but NOT Management Hub
- [ ] **Login as normal user**: Should see only Profile + Payment History
- [ ] **Open browser DevTools**: Check console logs for role information
- [ ] **Check sidebar rendering**: Confirm correct menu items appear
- [ ] **Profile form**: ID card fields only visible to instructors/superusers

## Fallback Behavior

If role detection fails for any reason:
- `is_superuser` defaults to `false`
- `is_instructor` defaults to `false`
- User sees normal/minimal dashboard

This ensures users aren't accidentally granted admin access if detection breaks.
