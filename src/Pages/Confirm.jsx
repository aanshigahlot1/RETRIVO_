import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ref, get, remove, push } from "firebase/database";
import { db } from "../Services/Firebase";
import Navbar from "../Components/Navbar";

export default function Confirm() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("Processing confirmation...");
  const [finder, setFinder] = useState(null);

  useEffect(() => {
    const lostId = searchParams.get("lost");
    const foundId = searchParams.get("found");

    if (!lostId || !foundId) {
      setStatus("❌ Invalid or expired confirmation link.");
      return;
    }

    const processConfirmation = async () => {
      try {
        const lostRef = ref(db, `lostItems/${lostId}`);
        const foundRef = ref(db, `foundItems/${foundId}`);

        const lostSnap = await get(lostRef);
        const foundSnap = await get(foundRef);

        if (!lostSnap.exists() || !foundSnap.exists()) {
          setStatus("⚠️ This item has already been resolved.");
          return;
        }

        const lostData = lostSnap.val();
        const foundData = foundSnap.val();

        // Save in history
        await push(ref(db, "historyItems"), {
          lost: lostData,
          found: foundData,
          resolvedAt: new Date().toISOString(),
        });

        // Remove from active lists
        await remove(lostRef);
        await remove(foundRef);

        // Show finder details
        setFinder(foundData);

        setStatus("✅ Item recovery confirmed successfully!");
      } catch (error) {
        console.error(error);
        setStatus("❌ Something went wrong. Please try again.");
      }
    };

    processConfirmation();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full text-center">

          <h1 className="text-2xl font-bold text-green-700 mb-4">
            RETRIVO Confirmation
          </h1>

          <p className="text-gray-700 text-lg mb-6">{status}</p>

          {/* Finder Contact Section */}
          {finder && (
            <div className="bg-green-100 rounded-xl p-5 mt-4 text-left">
              <h2 className="text-lg font-semibold text-green-800 mb-3">
                📞 Contact the Finder
              </h2>

              <p className="text-gray-700">
                <strong>Name:</strong> {finder.personName}
              </p>

              <p className="text-gray-700">
                <strong>Email:</strong> {finder.email}
              </p>

              <p className="text-gray-700">
                <strong>Phone:</strong> {finder.phone}
              </p>

              <p className="text-sm text-gray-500 mt-3">
                Please contact the finder to arrange item pickup.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}