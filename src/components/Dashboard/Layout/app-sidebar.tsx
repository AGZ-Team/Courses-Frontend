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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale()
  const t = useTranslations('dashboard')
  
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/instructors/1.jpg",
    },
    navMain: [
      {
        title: t('title'),
        url: "/dashboard",
        icon: IconDashboard,
        isActive: true,
      },
      {
        title: t('analytics'),
        url: "#",
        icon: IconChartBar,
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
    documents: [
      {
        name: t('users'),
        url: "/dashboard?view=users",
        icon: IconUsers,
      },
      {
        name: t('categories'),
        url: "#",
        icon: IconCategory,
      },
      {
        name: t('content'),
        url: "#",
        icon: IconFileText,
      },
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
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <LanguageSwitcher />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
