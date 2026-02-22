import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../Services/Firebase";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function History() {
  const [open, setOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const snapshot = await get(ref(db, "historyItems"));

        if (snapshot.exists()) {
          const data = snapshot.val();

          const itemsArray = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));

          itemsArray.sort((a, b) => b.resolvedAt - a.resolvedAt);
          setHistoryItems(itemsArray);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredItems = historyItems.filter(
    (item) =>
      item.lost?.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      item.lost?.location?.toLowerCase().includes(search.toLowerCase())
  );

  const cardAnim = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  };

  const HistoryCard = ({ item, i }) => (
    <motion.div
      variants={cardAnim}
      initial="hidden"
      animate="show"
      custom={i}
      whileHover={{ scale: 1.04, y: -6 }}
      onClick={() => setSelectedItem(item)}
      className="group bg-white border-2 border-green-200 rounded-xl shadow-sm hover:shadow-xl hover:border-green-400 transition cursor-pointer overflow-hidden"
    >
      {item.found?.imageURL && (
        <div className="h-32 bg-green-50 flex items-center justify-center p-2">
          <img
            src={item.found.imageURL}
            alt="Recovered"
            className="h-full w-full object-contain group-hover:scale-110 transition duration-500"
          />
        </div>
      )}

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {item.lost?.itemName || "Unknown Item"}
        </h3>

        <p className="text-[11px] text-gray-600 mt-1">
          📍 {item.lost?.location}
        </p>

        <p className="text-[11px] text-gray-600">
          👤 {item.found?.personName}
        </p>

        <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700">
          RECOVERED
        </span>

        <p className="text-[10px] text-gray-400 mt-2">
          {new Date(item.resolvedAt).toLocaleDateString()}
        </p>
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
          <Link to="/items">Items</Link>
          <Link to="/history" className="text-green-700 font-semibold">
            History
          </Link>
        </nav>
      </header>

      {/* HEADER */}
      <div className="px-4 md:px-10 py-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
          Recovery History
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Items successfully recovered through RETRIVO community.
        </p>

        {/* STATS */}
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-700">
              {historyItems.length}
            </p>
            <p className="text-sm text-gray-500">Total Recoveries</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-6">
          <input
            placeholder="Search recovered items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* GRID */}
        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">
            Loading history...
          </p>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 bg-white rounded-xl shadow p-6">
            No recovered items found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredItems.map((item, i) => (
              <HistoryCard key={item.id} item={item} i={i} />
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {selectedItem.found?.imageURL && (
                <div className="h-60 bg-green-50 flex items-center justify-center p-3">
                  <img
                    src={selectedItem.found.imageURL}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-bold text-green-700">
                  {selectedItem.lost?.itemName}
                </h3>

                <p className="text-sm mt-2">📍 {selectedItem.lost?.location}</p>
                <p className="text-sm">👤 Found by: {selectedItem.found?.personName}</p>
                <p className="text-sm">📧 {selectedItem.found?.email}</p>

                <p className="text-xs text-gray-400 mt-3">
                  Resolved on: {new Date(selectedItem.resolvedAt).toLocaleString()}
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