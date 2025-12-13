"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

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
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated after first render to avoid hydration mismatch
    setIsHydrated(true)
  }, [])

  return (
    <SidebarGroup 
      className={cn(
        "group-data-[collapsible=icon]:hidden transition-opacity duration-300",
        loading && "opacity-50 pointer-events-none"
      )}
      suppressHydrationWarning
    >
      <SidebarGroupLabel>{t('managementHub')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasLink = !!item.url && item.url !== "#"
          const href = hasLink
            ? `/${locale}${item.url.startsWith("/") ? item.url : `/${item.url}`}`
            : undefined
          const basePath = item.url?.split("?")[0] ?? ""
          let isActive: boolean | undefined

          if (hasLink && isHydrated) {
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
        })}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <IconDots className="text-sidebar-foreground/70" />
            <span>{t('more')}</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
