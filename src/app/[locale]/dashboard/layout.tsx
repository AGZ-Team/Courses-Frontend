export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="ltr" className="min-h-screen">
      {children}
    </div>
  )
}
