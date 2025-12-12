"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url?: string
  icon?: Icon
  isActive?: boolean
}

export function NavMain({ items }: { items: NavItem[] }) {
  const locale = useLocale()
  const pathname = usePathname()
  const normalizedPath = pathname?.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname
  const searchParams = useSearchParams()
  const view = searchParams?.get("view") ?? "overview"

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const hasLink = !!item.url && item.url !== "#"
            const href = hasLink
              ? `/${locale}${item.url?.startsWith("/") ? item.url : `/${item.url}`}`
              : undefined
            const basePath = item.url?.split("?")[0] ?? ""
            let isActive: boolean | undefined

            if (hasLink) {
              const isProfileLink = item.url?.includes("view=profile")

              if (isProfileLink) {
                // Highlight Profile only when we're on the dashboard with view=profile
                isActive = normalizedPath === basePath && view === "profile"
              } else if (basePath === "/dashboard") {
                // Highlight Dashboard only for the overview (no specific sub-view like profile or payments)
                isActive =
                  normalizedPath === basePath && (view === "overview" || !view)
              } else {
                isActive =
                  normalizedPath === basePath ||
                  normalizedPath?.startsWith(`${basePath}/`)
              }
            } else {
              isActive = item.isActive
            }

            const content = (
              <>
                {item.icon ? <item.icon /> : null}
                <span>{item.title}</span>
              </>
            )

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={!!isActive}
                  asChild={Boolean(href)}
                  suppressHydrationWarning
                >
                  {href ? <Link href={href}>{content}</Link> : content}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
