import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../Services/Firebase";
import Navbar from "../Components/Navbar";

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const snapshot = await get(ref(db, "historyItems"));

        if (snapshot.exists()) {
          const data = snapshot.val();

          // convert object → array
          const itemsArray = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));

          // latest first
          itemsArray.sort((a, b) => b.resolvedAt - a.resolvedAt);

          setHistoryItems(itemsArray);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
            Recovery History
          </h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading history...</p>
          ) : historyItems.length === 0 ? (
            <p className="text-center text-gray-500">
              No recovered items yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-md rounded-2xl p-5 border"
                >
                  <h2 className="text-xl font-semibold text-green-700 mb-2">
                    {item.lost?.itemName || "Unknown Item"}
                  </h2>

                  <p className="text-sm text-gray-600 mb-2">
                    📍 Location: {item.lost?.location}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    👤 Found by: {item.found?.personName}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    📧 Finder Email: {item.found?.email}
                  </p>

                  {item.found?.imageURL && (
                    <img
                      src={item.found.imageURL}
                      alt="Recovered item"
                      className="w-full h-48 object-cover rounded-xl mt-3"
                    />
                  )}

                  <p className="text-xs text-gray-400 mt-3">
                    Resolved on:{" "}
                    {new Date(item.resolvedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}