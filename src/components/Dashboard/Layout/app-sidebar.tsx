"use client"

import * as React from "react"
import {
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconUsers,
  IconCategory,
  IconFileText,
  IconCreditCard,
  type Icon,
} from "@tabler/icons-react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

import { LanguageSwitcher } from "@/components/Dashboard/Navigation/language-switcher"
import { NavDocuments } from "@/components/Dashboard/Navigation/nav-documents"
import { NavItems } from "@/components/Dashboard/Navigation/nav-items"
import { NavMain } from "@/components/Dashboard/Navigation/nav-main"
import { NavPages } from "@/components/Dashboard/Navigation/nav-pages"
import { NavSecondary } from "@/components/Dashboard/Navigation/nav-secondary"
import { NavUser } from "@/components/Dashboard/Navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/authStore"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale()
  const t = useTranslations('dashboard')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Normalize path and extract view parameter
  const normalizedPath = pathname?.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname
  const activeView = searchParams?.get("view") ?? "overview"
  
  // Use selectors to get user and role states directly
  // IMPORTANT: Read role booleans directly from user object, not from getter functions
  // This ensures immediate reactivity when user data updates
  const user = useAuthStore((state) => state.user)
  const rolesLoading = useAuthStore((state) => state.rolesLoading)
  const lockedRoles = useAuthStore((state) => state.lockedRoles)
  
  // Derive role booleans directly from user object for immediate reactivity
  // During loading, use lockedRoles (captured BEFORE loading started)
  const isSuperuser = rolesLoading && lockedRoles ? lockedRoles.is_superuser : user?.is_superuser === true
  const isInstructor = rolesLoading && lockedRoles ? lockedRoles.is_instructor : user?.is_instructor === true

  // Role rules:
  // - Superuser: sees Dashboard + Profile + Management Hub (Users/Categories/Subcategories/Content)
  // - Instructor: sees Dashboard + Profile + Management Hub (Content only)
  // - Normal user: sees Profile + Management Hub (Content only)
  const isNormalUser = !isSuperuser && !isInstructor
  
  // Build management hub items based on current user role
  const managementHubItems = React.useMemo(() => {
    const items: { name: string; url: string; icon: Icon }[] = []
    
    // Superusers see Users, Categories, Subcategories
    if (isSuperuser) {
      items.push(
        {
          name: t('users'),
          url: "/dashboard?view=users",
          icon: IconUsers,
        },
        {
          name: t('categories'),
          url: "/dashboard?view=categories",
          icon: IconCategory,
        },
        {
          name: t('subcategories'),
          url: "/dashboard?view=subcategories",
          icon: IconCategory,
        }
      );
    }
    
    // EVERYONE sees "Content" in Management Hub (superuser, instructor, normal user)
    // The Content component itself will handle role-based rendering
    items.push({
      name: "Content",
      url: "/dashboard?view=my-content",
      icon: IconFileText,
    });
    
    return items;
  }, [isSuperuser, isInstructor, t]);

  const data = {
    user: {
      name: user ? `${user.first_name} ${user.last_name}`.trim() || "User" : "User",
      email: user?.email || "user@example.com",
      avatar: user?.picture || "", // Empty string allows AvatarFallback to show initials
    },
    navMain: React.useMemo(() => {
      const items: { title: string; url: string; icon?: Icon; isActive?: boolean }[] = []

      // Normal user should not see the "Dashboard" (overview) tab.
      if (!isNormalUser) {
        items.push({
          title: t('title'),
          url: "/dashboard",
          icon: IconDashboard,
          isActive: true,
        })
      }

      // Everyone can see Profile (with proper translation)
      items.push({
        title: t('profile'),
        url: "/dashboard?view=profile",
        icon: IconUsers,
      })

      // Content is now ONLY in Management Hub, not here
      // All users will see it in Management Hub section below

      return items
    }, [isNormalUser, isSuperuser, isInstructor, t]),
    navSecondary: [
      {
        title: t('getHelp'),
        url: "/contact",
        icon: IconHelp,
      },
      {
        title: t('search'),
        url: "#",
        icon: IconSearch,
      },
    ],
    // Payment History - Visible to everyone
    payments: [
      {
        name: t('paymentHistory'),
        url: "/dashboard?view=payments",
        icon: IconCreditCard,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={`/${locale}`}>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">C R A I</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPages />
        <NavMain items={data.navMain.map(item => ({ ...item, icon: item.icon as Icon | undefined }))} />
        
        {/* Management Hub - Always mounted, never conditionally rendered
            When loading: pass empty array + loading=true to show only spinner
            When not loading: show correct items based on user role (or locked role if still updating)
            lockedRoles ensures items stay consistent during async updates */}
        <NavDocuments 
          items={rolesLoading ? [] : managementHubItems}
          loading={rolesLoading}
          activePath={normalizedPath}
          activeView={activeView}
        />
        
        {/* Payment History - For everyone (no label) */}
        {data.payments.length > 0 && (
          <NavItems items={data.payments} />
        )}
        
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <LanguageSwitcher />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: data.user.name, email: data.user.email, avatar: data.user.avatar }} />
      </SidebarFooter>
    </Sidebar>
  )
}
