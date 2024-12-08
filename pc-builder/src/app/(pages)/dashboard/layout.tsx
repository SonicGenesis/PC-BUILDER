import Sidebar from './components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <div className="ml-64 pt-20">
        {children}
      </div>
    </div>
  )
} 