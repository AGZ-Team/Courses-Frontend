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
  
  // Use selectors for specific state pieces to avoid unnecessary re-renders
  // This ensures managementHubItems only updates when actual roles change
  const isSuperuser = useAuthStore((state) => state.isSuperuser())
  const isInstructor = useAuthStore((state) => state.isInstructor())
  const rolesLoading = useAuthStore((state) => state.rolesLoading)
  const user = useAuthStore((state) => state.user)

  // Role rules:
  // - Superuser: sees everything
  // - Instructor: sees Dashboard + Profile + Payments, and "Content" in Management Hub
  // - Normal user: no Dashboard main tab; see Profile + Payments + Content
  const isNormalUser = !isSuperuser && !isInstructor

  // Build management hub items based on current user role
  // Dependencies: isSuperuser, isInstructor are now booleans (not functions)
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
    
    // Instructors and Superusers always see "Content" (no longer "My Content")
    if (isInstructor || isSuperuser) {
      items.push({
        name: "Content",
        url: "/dashboard?view=my-content",
        icon: IconFileText,
      });
    }
    
    return items;
  }, [isSuperuser, isInstructor, t]);

  // Stable placeholder items used while roles are loading.
  // We keep the section visible to avoid layout shifts and the "appears late" feeling.
  const managementHubSkeletonItems = React.useMemo(
    (): { name: string; url: string; icon: Icon }[] => [
      {
        name: t('users'),
        url: "#",
        icon: IconUsers,
      },
      {
        name: t('categories'),
        url: "#",
        icon: IconCategory,
      },
      {
        name: t('subcategories'),
        url: "#",
        icon: IconCategory,
      },
      {
        name: "Content",
        url: "#",
        icon: IconFileText,
      },
    ],
    [t]
  )

  // Always pass a stable array reference into NavDocuments.
  // Switching the array object back/forth contributes to flickery UI and can look like remounting.
  const managementHubRenderItems = rolesLoading || managementHubItems.length === 0
    ? managementHubSkeletonItems
    : managementHubItems

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

      // Everyone can see Profile
      items.push({
        title: t('profile'),
        url: "/dashboard?view=profile",
        icon: IconUsers,
      })

      // Normal user should also have a direct Content entry outside hub
      // (in addition to Management Hub's Content) per your requested behavior.
      if (isNormalUser) {
        items.push({
          title: "Content",
          url: "/dashboard?view=my-content",
          icon: IconFileText,
        })
      }

      return items
    }, [isNormalUser, t]),
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

  // Debug logging
  React.useEffect(() => {
    if (rolesLoading) {
      console.log('AppSidebar: rolesLoading=true, showing skeleton')
    } else {
      console.log('AppSidebar: rolesLoading=false, managementHubItems:', managementHubItems)
    }
  }, [rolesLoading, managementHubItems])

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
            Pass loading state and active view as props instead of using hooks inside
            This prevents re-renders and maintains component state */}
        <NavDocuments 
          items={managementHubRenderItems}
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
