"use client"

import { useUserProfile } from "@/hooks/useUserProfile"
import { ContentLoadingOverlay } from "@/components/Dashboard/ContentLoadingOverlay"
import React from "react"

/**
 * Wrapper component that shows content loading overlay while user data is being fetched
 * Sidebar remains static and visible during loading
 */
export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { loading } = useUserProfile()

  return (
    <div className="relative">
      {loading && <ContentLoadingOverlay />}
      {children}
    </div>
  )
}
