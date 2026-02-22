import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../Services/Firebase";
import Navbar from "../Components/Navbar";

export default function Items() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // LOST ITEMS
        const lostSnap = await get(ref(db, "lostItems"));
        if (lostSnap.exists()) {
          const data = lostSnap.val();
          const arr = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));
          setLostItems(arr.reverse());
        }

        // FOUND ITEMS
        const foundSnap = await get(ref(db, "foundItems"));
        if (foundSnap.exists()) {
          const data = foundSnap.val();
          const arr = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));
          setFoundItems(arr.reverse());
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
            Browse Items
          </h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading items...</p>
          ) : (
            <>
              {/* LOST ITEMS */}
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-red-600 mb-6">
                  🔴 Lost Items
                </h2>

                {lostItems.length === 0 ? (
                  <p className="text-gray-500">No lost items found.</p>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {lostItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-md p-4 border"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.itemName}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          📍 {item.location}
                        </p>

                        <p className="text-sm text-gray-600">
                          📅 {item.lostDate}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                          {item.description}
                        </p>

                        {item.imageURL && (
                          <img
                            src={item.imageURL}
                            alt="Lost item"
                            className="w-full h-40 object-cover rounded-lg mt-3"
                          />
                        )}

                        <p className="text-xs text-gray-400 mt-3">
                          Contact: {item.email}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* FOUND ITEMS */}
              <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-6">
                  🟢 Found Items
                </h2>

                {foundItems.length === 0 ? (
                  <p className="text-gray-500">No found items yet.</p>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {foundItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-md p-4 border"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.itemName}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          📍 {item.location}
                        </p>

                        <p className="text-sm text-gray-600">
                          📅 {item.foundDate}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                          {item.description}
                        </p>

                        {item.imageURL && (
                          <img
                            src={item.imageURL}
                            alt="Found item"
                            className="w-full h-40 object-cover rounded-lg mt-3"
                          />
                        )}

                        <p className="text-xs text-gray-400 mt-3">
                          Found by: {item.personName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}