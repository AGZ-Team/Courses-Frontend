import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactQueryProvider>
      <div dir="ltr" className="min-h-screen">
        {children}
      </div>
    </ReactQueryProvider>
  )
}
