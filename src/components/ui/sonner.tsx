"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-2xl border bg-white/95 text-[#0b0b2b] shadow-[0_12px_40px_rgba(13,13,18,0.12)] backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-card/90 dark:text-foreground dark:border-white/10",
          description: "text-xs text-muted-foreground",
          actionButton:
            "bg-[#0bb2b0] text-white hover:bg-[#0bb2b0]/90",
          cancelButton:
            "bg-muted text-foreground hover:bg-muted/80",
          closeButton:
            "text-foreground/60 hover:text-foreground",
          success:
            "border-[#0bb2b0]/25 before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-r before:from-[#0bb2b0]/30 before:via-[#22c55e]/20 before:to-[#0bb2b0]/30 before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:xor] before:pointer-events-none",
          error:
            "border-red-500/25 before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-r before:from-red-500/25 before:via-rose-500/10 before:to-red-500/25 before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:xor] before:pointer-events-none",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
