"use client"

import * as React from "react"
import { IconChevronDown, IconHome2 } from "@tabler/icons-react"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavPages() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const tDashboard = useTranslations('dashboard')
  const [isOpen, setIsOpen] = React.useState(false)

  const pages = [
    {
      title: t('home'),
      url: `/${locale}`,
    },
    {
      title: t('about'),
      url: `/${locale}/about`,
    },
    {
      title: t('creators'),
      url: `/${locale}/creators`,
    },
    {
      title: t('explore'),
      url: `/${locale}/courses`,
    },
    {
      title: t('contact'),
      url: `/${locale}/contact`,
    },
  ]

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={tDashboard('mainPages')}>
                <IconHome2 />
                <span>{tDashboard('mainPages')}</span>
                <IconChevronDown className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {pages.map((page) => (
                  <SidebarMenuSubItem key={page.url}>
                    <SidebarMenuSubButton asChild>
                      <Link href={page.url}>
                        <span>{page.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
