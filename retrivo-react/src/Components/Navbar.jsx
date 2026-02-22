import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Lost", path: "/lost" },
    { name: "Found", path: "/found" },
    { name: "Items", path: "/items" },
    { name: "History", path: "/history" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold text-green-700 tracking-wide hover:scale-105 transition-transform duration-300"
        >
          RETRIVO
        </Link>

        {/* Navigation */}
        <nav className="flex gap-2 md:gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-green-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-800"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}