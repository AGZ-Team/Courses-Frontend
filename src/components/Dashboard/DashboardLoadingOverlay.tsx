"use client"

import React from 'react'

/**
 * Full-page loading overlay with impressive spinner
 * Matches the project's teal/cyan theme
 */
export function DashboardLoadingOverlay() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 backdrop-blur-sm">
			<div className="flex flex-col items-center space-y-6">
				{/* Animated spinner rings */}
				<div className="relative">
					{/* Outer ring */}
					<div className="absolute h-32 w-32 animate-spin rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-400"></div>
          
					{/* Middle ring */}
					<div className="absolute h-32 w-32 animate-spin-slow rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-400" style={{ animationDirection: 'reverse' }}></div>
          
					{/* Inner ring */}
					<div className="absolute inset-4 h-24 w-24 animate-pulse rounded-full border-4 border-transparent border-t-teal-600 border-b-teal-600"></div>
          
					{/* Center dot with pulse */}
					<div className="absolute inset-0 m-auto h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-300/50"></div>
          
					{/* Inner glow */}
					<div className="absolute inset-0 m-auto h-8 w-8 animate-ping rounded-full bg-teal-300 opacity-75"></div>
				</div>

				{/* Loading text */}
				<div className="flex flex-col items-center space-y-2">
					<h3 className="text-xl font-semibold text-teal-900 animate-pulse">
						Loading Dashboard
					</h3>
					<p className="text-sm text-teal-600">
						Preparing your personalized experience...
					</p>
				</div>

				{/* Animated dots */}
				<div className="flex space-x-2">
					<div className="h-3 w-3 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: '0ms' }}></div>
					<div className="h-3 w-3 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: '150ms' }}></div>
					<div className="h-3 w-3 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: '300ms' }}></div>
				</div>
			</div>
		</div>
	)
}

