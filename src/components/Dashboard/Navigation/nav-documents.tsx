"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { IconLoader2 } from "@tabler/icons-react"
import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Icon } from "@tabler/icons-react"

export function NavDocuments({
  items,
  loading = false,
  activePath = "",
  activeView = "overview",
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
  loading?: boolean
  activePath?: string
  activeView?: string
}) {
  const t = useTranslations('dashboard')
  const locale = useLocale()

  return (
    <SidebarGroup 
      className="group-data-[collapsible=icon]:hidden"
    >
      <SidebarGroupLabel>{t('managementHub')}</SidebarGroupLabel>
      <SidebarMenu>
        {loading ? (
          // Show a centered loading spinner during role loading/updates
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="size-6 animate-spin text-sidebar-foreground/50" />
          </div>
        ) : (
          items.map((item) => {
          const hasLink = !!item.url && item.url !== "#"
          const href = hasLink
            ? `/${locale}${item.url.startsWith("/") ? item.url : `/${item.url}`}`
            : undefined
          const basePath = item.url?.split("?")[0] ?? ""
          let isActive: boolean | undefined

          if (hasLink) {
            // Extract view parameter from URL
            const urlView = item.url?.split("view=")[1]
            
            if (urlView) {
              // Match based on view parameter from props instead of useSearchParams
              isActive = activePath === basePath && activeView === urlView
            } else {
              // Default path matching using activePath prop
              isActive =
                activePath === basePath ||
                activePath?.startsWith(`${basePath}/`)
            }
          } else {
            isActive = false
          }

          return (
            <SidebarMenuItem 
              key={item.name}
              className={cn(
                "transition-all duration-200",
                loading && "animate-pulse"
              )}
            >
              {href ? (
                <SidebarMenuButton asChild isActive={!!isActive} className="cursor-pointer">
                  <Link href={href} prefetch={false}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton isActive={!!isActive}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          )
        })
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
