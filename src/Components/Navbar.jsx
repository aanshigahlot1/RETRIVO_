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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-700 tracking-wide"
        >
          RETRIVO
        </Link>

        {/* Navigation */}
        <nav className="flex gap-4 md:gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm md:text-base transition ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:bg-green-100"
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