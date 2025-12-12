import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { AppSidebar } from "@/components/Dashboard/Layout/app-sidebar"
import { ChartAreaInteractive } from "@/components/Dashboard/Charts/chart-area-interactive"
import { DataTable } from "@/components/Dashboard/Tables/data-table"
import { SectionCards } from "@/components/Dashboard/Layout/section-cards"
import { SiteHeader } from "@/components/Dashboard/Layout/site-header"
import ProfileSettingsPanel from "@/components/Dashboard/Panels/ProfileSettingsPanel"
import PaymentHistoryPanel from "@/components/Dashboard/Panels/PaymentHistoryPanel"
import UsersPanel from "@/components/Dashboard/Panels/UsersPanel"
import CategoriesPanel from "@/components/Dashboard/Panels/CategoriesPanel"
import SubcategoriesPanel from "@/components/Dashboard/Panels/SubcategoriesPanel"
import MyContentPanel from "@/components/Dashboard/Panels/MyContentPanel"
import { DashboardUserLoader } from "@/components/Dashboard/DashboardUserLoader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

type DashboardMetadataProps = {
  params: Promise<{ locale: string }>
}

interface DashboardPageProps {
  searchParams?: Promise<{
    view?: string
  }>
}

export async function generateMetadata({ params }: DashboardMetadataProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ namespace: "dashboard", locale })

  return {
    title: t("title"),
  }
}

export default async function Page({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams
  const view = resolvedSearchParams?.view ?? "overview"
  const showProfile = view === "profile"
  const showPayments = view === "payments"
  const showUsers = view === "users"
  const showCategories = view === "categories"
  const showSubcategories = view === "subcategories"
  const showMyContent = view === "my-content"

  return (
    <DashboardUserLoader>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {showProfile ? (
                <ProfileSettingsPanel />
              ) : showPayments ? (
                <PaymentHistoryPanel />
              ) : showUsers ? (
                <UsersPanel />
              ) : showCategories ? (
                <CategoriesPanel />
              ) : showSubcategories ? (
                <SubcategoriesPanel />
              ) : showMyContent ? (
                <MyContentPanel />
              ) : (
                <>
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                  {/* <DataTable data={data} /> */}
                </>
              )}
            </div>
          </div>
        </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardUserLoader>
  )
}
