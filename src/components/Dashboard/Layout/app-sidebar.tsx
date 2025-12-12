"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconUsers,
  IconCategory,
  IconFileText,
  IconCreditCard,
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
  const { user, shouldShowManagementHub, shouldShowMyContent, isSuperuser, isInstructor } = useAuthStore()

  // Build management hub items based on current user role
  // This runs immediately without waiting for mount to ensure sidebar renders instantly
  const managementHubItems = (() => {
    const items = [];
    
    // Superusers see Users, Categories, Subcategories
    if (user?.is_superuser) {
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
    
    // Instructors and Superusers see My Content
    if (user?.is_instructor || user?.is_superuser) {
      items.push({
        name: "My Content",
        url: "/dashboard?view=my-content",
        icon: IconFileText,
      });
    }
    
    return items;
  })();

  const data = {
    user: {
      name: user ? `${user.first_name} ${user.last_name}` : "User",
      email: user?.email || "user@example.com",
      avatar: user?.picture || "/instructors/1.jpg",
    },
    navMain: [
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
    ],
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
        <NavMain items={data.navMain} />
        
        {/* Management Hub - Consolidates all management items based on role */}
        {managementHubItems.length > 0 && (
          <NavDocuments items={managementHubItems} />
        )}
        
        {/* Payment History - For everyone (no label) */}
        {data.payments.length > 0 && (
          <NavItems items={data.payments} />
        )}
        
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <LanguageSwitcher />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
