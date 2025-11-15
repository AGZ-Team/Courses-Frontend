"use client"

import * as React from "react"
import { IconLanguage } from "@tabler/icons-react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en"
    // Remove current locale from pathname and add new locale
    const segments = pathname.split("/")
    segments[1] = newLocale
    const newPath = segments.join("/")
    router.push(newPath)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={switchLocale}>
              <IconLanguage />
              <span>{locale === "en" ? "العربية" : "English"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
