import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center">

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
            RETRIVO — Smart Lost & Found
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg mb-2">
            Misplaced something? Someone might have found it.
          </p>

          <p className="text-gray-600 text-lg mb-8">
            RETRIVO connects honest people and helps recover lost items
            through a simple and verified process.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              to="/lost"
              className="bg-green-700 text-white px-6 py-3 rounded-xl shadow hover:bg-green-800 transition"
            >
              📦 Report Lost Item
            </Link>

            <Link
              to="/found"
              className="bg-white border border-green-700 text-green-700 px-6 py-3 rounded-xl shadow hover:bg-green-100 transition"
            >
              🔍 Report Found Item
            </Link>

            <Link
              to="/items"
              className="bg-white border border-green-700 text-green-700 px-6 py-3 rounded-xl shadow hover:bg-green-100 transition"
            >
              📋 Browse Items
            </Link>

          </div>

          {/* Footer text */}
          <p className="text-sm text-gray-500 mt-10">
            Privacy-aware • Human-centered • Built for trust
          </p>

        </div>
      </div>
    </>
  );
}