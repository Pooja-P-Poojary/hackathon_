export default function Navbar({ title }) {
  return (
    <header className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4">
      <h2 className="text-white text-xl font-semibold">{title}</h2>
    </header>
  );
}