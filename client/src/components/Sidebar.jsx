export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 border-r border-gray-800 p-4">
      <h1 className="text-white font-semibold text-lg mb-6">Hackathon</h1>
      <nav className="flex flex-col gap-2 text-sm text-gray-300">
        <a href="/dashboard" className="hover:text-white">Dashboard</a>
        <a href="/dean-approval" className="hover:text-white">Dean Approval</a>
        <a href="/reports" className="hover:text-white">Reports</a>
      </nav>
    </aside>
  );
}