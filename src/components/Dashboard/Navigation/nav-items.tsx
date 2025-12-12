"use client"

import type { Icon } from "@tabler/icons-react"
import { useLocale } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

/**
 * Navigation items without a group label
 * Used for Payment History and other standalone items
 */
export function NavItems({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const locale = useLocale()
  const pathname = usePathname()
  const normalizedPath = pathname?.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname
  const searchParams = useSearchParams()
  const view = searchParams?.get("view") ?? "overview"

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items.map((item) => {
          const hasLink = !!item.url && item.url !== "#"
          const href = hasLink
            ? `/${locale}${item.url.startsWith("/") ? item.url : `/${item.url}`}`
            : undefined
          const basePath = item.url?.split("?")[0] ?? ""
          let isActive: boolean | undefined

          if (hasLink) {
            const urlView = item.url?.split("view=")[1]
            if (urlView) {
              isActive = normalizedPath === basePath && view === urlView
            } else {
              isActive =
                normalizedPath === basePath ||
                normalizedPath?.startsWith(`${basePath}/`)
            }
          } else {
            isActive = false
          }

          return (
            <SidebarMenuItem key={item.name}>
              {href ? (
                <SidebarMenuButton asChild isActive={!!isActive} className="cursor-pointer">
                  <a href={href}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
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
      </SidebarMenu>
    </SidebarGroup>
  )
}
