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
  const { user, isSuperuser, isInstructor } = useAuthStore()

  // Treat missing user as "roles still loading" so we can render a stable sidebar
  // skeleton (prevents Management Hub from appearing late / causing reflow).
  const rolesLoading = !user

  // Build management hub items based on current user role
  // Use memoization to prevent rebuilding on every render
  const managementHubItems = React.useMemo(() => {
    const items: { name: string; url: string; icon: Icon }[] = []
    
    // Superusers see Users, Categories, Subcategories
    if (isSuperuser()) {
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
    
    // Instructors and Superusers see My Content (Content for superusers)
    if (isInstructor() || isSuperuser()) {
      items.push({
        name: isSuperuser() ? "Content" : "My Content",
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
        name: "My Content",
        url: "#",
        icon: IconFileText,
      },
    ],
    [t]
  )

  const data = {
    user: {
      name: user ? `${user.first_name} ${user.last_name}`.trim() || "User" : "User",
      email: user?.email || "user@example.com",
      avatar: user?.picture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3C/svg%3E",
    },
    navMain: (() => {
      // Always include Dashboard and Profile in the array structure
      // NavMain will handle showing/hiding based on role
      const baseItems: { title: string; url: string; icon?: Icon; isActive?: boolean }[] = [
        {
          title: t('title'),
          url: "/dashboard",
          icon: IconDashboard,
          isActive: true,
        },
        {
          title: t('profile'),
          url: "/dashboard?view=profile",
          icon: IconUsers,
        },
      ];
      
      return baseItems;
    })(),
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
        
        {/* Management Hub - Consolidates all management items based on role */}
        {rolesLoading ? (
          <div className="opacity-70 pointer-events-none">
            <NavDocuments items={managementHubSkeletonItems} />
          </div>
        ) : managementHubItems.length > 0 ? (
          <NavDocuments items={managementHubItems} />
        ) : null}
        
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
