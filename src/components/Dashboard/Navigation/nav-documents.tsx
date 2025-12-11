"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"

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
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const pathname = usePathname()
  const normalizedPath = pathname?.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname
  const searchParams = useSearchParams()
  const view = searchParams?.get("view") ?? "overview"

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('managementHub')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasLink = !!item.url && item.url !== "#"
          const href = hasLink
            ? `/${locale}${item.url.startsWith("/") ? item.url : `/${item.url}`}`
            : undefined
          const basePath = item.url?.split("?")[0] ?? ""
          let isActive: boolean | undefined

          if (hasLink) {
            const isPaymentsLink = item.url?.includes("view=payments")
            const isUsersLink = item.url?.includes("view=users")
            const isCategoriesLink = item.url?.includes("view=categories")
            const isSubcategoriesLink = item.url?.includes("view=subcategories")

            if (isPaymentsLink) {
              // Highlight Payment History only when we're on the dashboard payments view
              isActive = normalizedPath === basePath && view === "payments"
            } else if (isUsersLink) {
              // Highlight Users only when we're on the dashboard users view
              isActive = normalizedPath === basePath && view === "users"
            } else if (isCategoriesLink) {
              // Highlight Categories only when we're on the dashboard categories view
              isActive = normalizedPath === basePath && view === "categories"
            } else if (isSubcategoriesLink) {
              // Highlight Subcategories only when we're on the dashboard subcategories view
              isActive = normalizedPath === basePath && view === "subcategories"
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
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-sm"
                  >
                    <IconDots />
                    <span className="sr-only">{t('more')}</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <IconFolder />
                    <span>{t('open')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconShare3 />
                    <span>{t('share')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <IconTrash />
                    <span>{t('delete')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
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
