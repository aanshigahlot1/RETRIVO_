import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const testimonials = [
    {
      name: "Aman Sharma",
      text: "Lost my wallet in college — got it back within 2 days using RETRIVO!",
    },
    {
      name: "Priya Verma",
      text: "Super easy to report found items. Love the clean experience.",
    },
    {
      name: "Rahul Singh",
      text: "This platform actually builds trust between people. Amazing idea!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200">

      {/* TOP NAVBAR */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 bg-white/80 backdrop-blur-md shadow-sm">

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-green-100 transition"
          >
            <Menu size={26} className="text-green-700" />
          </button>

          <h1 className="text-3xl font-extrabold text-green-700 tracking-wide">
            RETRIVO
          </h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-green-700">Home</Link>
          <Link to="/lost" className="hover:text-green-700">Lost</Link>
          <Link to="/found" className="hover:text-green-700">Found</Link>
          <Link to="/items" className="hover:text-green-700">Items</Link>
          <Link to="/history" className="hover:text-green-700">History</Link>
        </nav>
      </header>

      {/* SIDEBAR MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 p-6"
          >
            <button onClick={() => setOpen(false)}>
              <X className="mb-6 text-green-700" />
            </button>

            <div className="flex flex-col gap-4 text-lg font-medium">
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/lost" onClick={() => setOpen(false)}>Lost</Link>
              <Link to="/found" onClick={() => setOpen(false)}>Found</Link>
              <Link to="/items" onClick={() => setOpen(false)}>Items</Link>
              <Link to="/history" onClick={() => setOpen(false)}>History</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SECTION */}
      <div className="grid md:grid-cols-2 min-h-[calc(100vh-80px)] px-6 md:px-12 py-10">

        {/* LEFT SIDE HERO */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <span className="inline-block px-4 py-1 bg-green-200 text-green-800 rounded-full text-sm w-fit mb-4">
            Trusted Community Platform
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-green-700 leading-tight mb-6">
            Smart Lost <br /> & Found System
          </h1>

          <p className="text-gray-700 text-lg mb-3">
            Misplaced something? Someone might have found it.
          </p>

          <p className="text-gray-600 max-w-lg mb-8">
            RETRIVO connects honest people and helps recover lost items
            through a secure, verified and community-driven process.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/lost"
              className="bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-800 transition"
            >
              📦 Report Lost
            </Link>

            <Link
              to="/found"
              className="bg-white border border-green-700 text-green-700 px-6 py-3 rounded-xl hover:bg-green-100 transition"
            >
              🔍 Report Found
            </Link>

            <Link
              to="/items"
              className="bg-white border border-green-700 text-green-700 px-6 py-3 rounded-xl hover:bg-green-100 transition"
            >
              📋 Browse Items
            </Link>
          </div>
        </motion.div>

        {/* RIGHT SIDE TESTIMONIALS */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center gap-5 mt-10 md:mt-0"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            💬 What Users Say
          </h2>

          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl p-5 shadow-md"
            >
              <p className="text-gray-700 text-sm mb-3">“{t.text}”</p>
              <p className="text-green-700 font-semibold text-sm">
                — {t.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}