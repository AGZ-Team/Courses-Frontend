"use client";

import { useCallback } from "react";

export default function SidebarToggleButton() {
  const onClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("lesson-sidebar-toggle"));
  }, []);

  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      onClick={onClick}
      className="fixed mt-6 right-3 sm:right-4 top-36 z-40 lg:hidden inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
