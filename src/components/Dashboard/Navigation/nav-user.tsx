"use client"

import * as React from "react"
import {
  IconCreditCard,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { useRouter } from "@/i18n/routing"
import { clearTokens } from "@/services/authService"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const t = useTranslations('dashboard')
  const router = useRouter()

  const [cacheBust, setCacheBust] = React.useState<string>("")
  React.useEffect(() => {
    setCacheBust(String(Date.now()))
  }, [])

  // Use the user prop directly (from Zustand) without localStorage override
  const displayName = user.name || "User"
  const displayEmail = user.email || ""
  
  // Debug logging
  React.useEffect(() => {
    console.log('[NavUser] User avatar URL:', user.avatar);
  }, [user.avatar]);

  // Bust cache for avatars that may have been recently updated.
  const avatarSrc = user.avatar
    ? `${user.avatar}${user.avatar.includes("?") ? "&" : "?"}v=${encodeURIComponent(cacheBust)}`
    : "";

  // Extract user initials from name (e.g., "Galal Elsayed" -> "GE")
  const getUserInitials = (name: string): string => {
    if (!name || name === "User") return "U"
    const nameParts = name.trim().split(/\s+/)
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase()
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  const userInitials = getUserInitials(displayName)

  const handleLogout = async () => {
    // Clear tokens centrally and notify listeners
    await clearTokens()
    router.push("/login")
  }

  const handleGoToProfile = () => {
    router.push("/dashboard?view=profile")
  }

  const handleGoToBilling = () => {
    router.push("/dashboard?view=payments")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatar ? (
                  <AvatarImage 
                    src={avatarSrc} 
                    alt={displayName}
                    onError={() => {
                      // Silently handle avatar load errors
                    }}
                  />
                ) : null}
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-white">{displayName}</span>
                <span className="truncate text-xs text-white/70">
                  {displayEmail}
                </span>
              </div>
              {/* <IconDotsVertical className="ml-auto size-4" /> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleGoToProfile}>
                <IconUserCircle />
                {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToBilling}>
                <IconCreditCard />
                {t('billing')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
