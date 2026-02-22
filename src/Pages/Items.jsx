import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../Services/Firebase";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Items() {
  const [open, setOpen] = useState(false);

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const lostSnap = await get(ref(db, "lostItems"));
        if (lostSnap.exists()) {
          const data = lostSnap.val();
          setLostItems(
            Object.entries(data).map(([id, value]) => ({
              id,
              ...value,
              type: "lost",
            })).reverse()
          );
        }

        const foundSnap = await get(ref(db, "foundItems"));
        if (foundSnap.exists()) {
          const data = foundSnap.val();
          setFoundItems(
            Object.entries(data).map(([id, value]) => ({
              id,
              ...value,
              type: "found",
            })).reverse()
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filterItems = (items) =>
    items.filter(
      (item) =>
        item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase())
    );

  const allItems = [...lostItems, ...foundItems];

  const displayItems =
    filter === "lost"
      ? filterItems(lostItems)
      : filter === "found"
      ? filterItems(foundItems)
      : filterItems(allItems);

  const cardAnim = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  };

  const ItemCard = ({ item, i }) => (
    <motion.div
      variants={cardAnim}
      initial="hidden"
      animate="show"
      custom={i}
      whileHover={{ scale: 1.04, y: -6 }}
      onClick={() => setSelectedItem(item)}
      className="group bg-white border-2 border-green-200 rounded-xl shadow-sm hover:shadow-xl hover:border-green-400 transition-all cursor-pointer overflow-hidden"
    >
      {item.imageURL && (
        <div className="h-32 bg-green-50 flex items-center justify-center p-2 overflow-hidden">
          <img
            src={item.imageURL}
            alt="item"
            className="h-full w-full object-contain group-hover:scale-110 transition duration-500"
          />
        </div>
      )}

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {item.itemName}
        </h3>

        <p className="text-[11px] text-gray-600 mt-1">📍 {item.location}</p>

        <p className="text-[11px] text-gray-600">
          📅 {item.type === "lost" ? item.lostDate : item.foundDate}
        </p>

        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
          {item.description}
        </p>

        <span
          className={`inline-block mt-2 text-[10px] px-2 py-1 rounded-full ${
            item.type === "lost"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {item.type.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)}>☰</button>
          <h1 className="text-3xl font-bold text-green-700">RETRIVO</h1>
        </div>

        <nav className="hidden md:flex gap-6 text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/lost">Lost</Link>
          <Link to="/found">Found</Link>
          <Link to="/items" className="text-green-700 font-semibold">
            Items
          </Link>
          <Link to="/history">History</Link>
        </nav>
      </header>

      {/* HEADER SECTION */}
      <div className="px-4 md:px-10 py-8">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-3">
          Browse Community Items
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Explore lost and found items shared by the community.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <p className="text-green-700 font-bold">{lostItems.length}</p>
            <p className="text-xs text-gray-500">Lost</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <p className="text-green-700 font-bold">{foundItems.length}</p>
            <p className="text-xs text-gray-500">Found</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <p className="text-green-700 font-bold">{allItems.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-4">
          <input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* FILTER TABS */}
        <div className="flex justify-center gap-3 mb-6">
          {["all", "lost", "found"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm ${
                filter === f
                  ? "bg-green-700 text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ITEMS GRID */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {displayItems.map((item, i) => (
              <ItemCard key={item.id} item={item} i={i} />
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              {selectedItem.imageURL && (
                <div className="h-60 bg-green-50 flex items-center justify-center p-3">
                  <img
                    src={selectedItem.imageURL}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-bold text-green-700">
                  {selectedItem.itemName}
                </h3>
                <p className="text-sm mt-2">📍 {selectedItem.location}</p>
                <p className="text-sm">
                  📅 {selectedItem.type === "lost"
                    ? selectedItem.lostDate
                    : selectedItem.foundDate}
                </p>
                <p className="text-sm mt-3 text-gray-600">
                  {selectedItem.description}
                </p>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}