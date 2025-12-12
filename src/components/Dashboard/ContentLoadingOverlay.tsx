"use client"

import React from 'react'

/**
 * Loading overlay for main dashboard content area
 * Shows while user data is being fetched
 */
export function ContentLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated spinner */}
        <div className="relative">
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-400"></div>
          <div className="absolute inset-0 m-auto h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-300/50"></div>
        </div>

        {/* Loading text */}
        <p className="text-sm font-medium text-teal-600">
          Loading content...
        </p>
      </div>
    </div>
  )
}
