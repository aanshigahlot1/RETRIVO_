import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../Services/Firebase";
import { ref, push, get } from "firebase/database";
import { uploadImage } from "../Services/cloudinary";
import { sendConfirmationEmail } from "../Services/email";

export default function Found() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    personName: "",
    userType: "Student",
    itemName: "",
    foundDate: "",
    location: "",
    description: "",
    email: "",
    phone: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageURL = "";
      if (image) imageURL = await uploadImage(image);

      const foundRef = ref(db, "foundItems");

      const newFound = await push(foundRef, {
        ...form,
        itemName: form.itemName.trim(),
        location: form.location.trim(),
        imageURL,
        timestamp: Date.now(),
      });

      const lostSnap = await get(ref(db, "lostItems"));

      if (lostSnap.exists()) {
        const lostData = lostSnap.val();

        for (const [id, lost] of Object.entries(lostData)) {
          const itemMatch =
            lost.itemName?.trim().toLowerCase() ===
            form.itemName.trim().toLowerCase();

          const locationMatch =
            lost.location?.trim().toLowerCase() ===
            form.location.trim().toLowerCase();

          if (itemMatch && locationMatch) {
            const confirmLink =
              `${window.location.origin}/RETRIVO_/#/confirm?lost=${id}&found=${newFound.key}`;

            await sendConfirmationEmail({
              toEmail: lost.email,
              itemName: lost.itemName,
              location: lost.location,
              finderName: form.personName,
              confirmLink,
            });
          }
        }
      }

      alert("🎉 Found item submitted successfully!");

      setForm({
        personName: "",
        userType: "Student",
        itemName: "",
        foundDate: "",
        location: "",
        description: "",
        email: "",
        phone: "",
      });

      setImage(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-green-100"
          >
            ☰
          </button>
          <h1 className="text-3xl font-bold text-green-700">RETRIVO</h1>
        </div>

        <nav className="hidden md:flex gap-6 text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/lost">Lost</Link>
          <Link to="/found" className="text-green-700 font-semibold">
            Found
          </Link>
          <Link to="/items">Items</Link>
          <Link to="/history">History</Link>
        </nav>
      </header>

      {/* SIDEBAR */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 p-6"
          >
            <button onClick={() => setOpen(false)} className="text-2xl mb-6">
              ✕
            </button>

            <div className="flex flex-col gap-4 text-lg">
              <Link to="/">Home</Link>
              <Link to="/lost">Lost</Link>
              <Link to="/found">Found</Link>
              <Link to="/items">Items</Link>
              <Link to="/history">History</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SECTION */}
      <div className="grid lg:grid-cols-5 gap-6 px-4 md:px-10 py-10">

        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          <h2 className="text-3xl font-bold text-green-700">
            Returning Items Builds Trust 🤝
          </h2>

          {[
            { icon: "🎉", text: "100+ Successful Returns" },
            { icon: "👥", text: "500+ Helpful Users" },
            { icon: "⚡", text: "Fast Matching System" },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white rounded-2xl shadow-md border p-5 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                {card.icon}
              </div>
              <p className="text-xl font-semibold text-green-700">
                {card.text}
              </p>
            </motion.div>
          ))}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700">
            💡 Tip: Upload clear images and exact location for faster matching.
          </div>

          {/* HOW RETRIVO WORKS */}
          <div className="bg-white rounded-2xl shadow-md border p-5">
            <h3 className="text-lg font-bold text-green-700 mb-3">
              How RETRIVO Works
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>1️⃣ Report the found item details.</p>
              <p>2️⃣ System checks matching lost items.</p>
              <p>3️⃣ Owner receives confirmation email.</p>
            </div>
          </div>

          {/* TRUST BADGES */}
          <div className="grid grid-cols-3 gap-2">
            {["🔒 Secure", "✔ Verified", "🤝 Community"].map((b, i) => (
              <div
                key={i}
                className="bg-white border rounded-lg text-center text-sm py-2 shadow-sm text-green-700 font-medium"
              >
                {b}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border p-8"
        >
          <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
            🎁 Report Found Item
          </h1>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input name="personName" value={form.personName} onChange={handleChange} placeholder="Your Name" className="border rounded-lg p-3" required />
            <select name="userType" value={form.userType} onChange={handleChange} className="border rounded-lg p-3">
              <option>Student</option>
              <option>Professor</option>
              <option>Guard</option>
              <option>Other Staff</option>
            </select>

            <input name="itemName" value={form.itemName} onChange={handleChange} placeholder="Item Name" className="border rounded-lg p-3" required />
            <input type="date" name="foundDate" value={form.foundDate} onChange={handleChange} className="border rounded-lg p-3" required />

            <input name="location" value={form.location} onChange={handleChange} placeholder="Location Found" className="border rounded-lg p-3 md:col-span-2" required />

            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border rounded-lg p-3 md:col-span-2 h-24" />

            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border rounded-lg p-3" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border rounded-lg p-3" required />

            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="md:col-span-2" />

            <button disabled={loading} className="md:col-span-2 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800">
              {loading ? "Submitting..." : "Submit Found Item"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* SECURITY / TRUST SECTION */}
      <div className="px-4 md:px-10 pb-10">
        <div className="bg-white rounded-2xl shadow-md border p-6 grid md:grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="font-semibold text-green-700">🔒 Secure Data</h3>
            <p className="text-sm text-gray-600">Your details remain private and protected.</p>
          </div>
          <div>
            <h3 className="font-semibold text-green-700">✔ Verified Matching</h3>
            <p className="text-sm text-gray-600">Smart matching system helps owners quickly.</p>
          </div>
          <div>
            <h3 className="font-semibold text-green-700">🤝 Community Driven</h3>
            <p className="text-sm text-gray-600">People helping people recover belongings.</p>
          </div>
        </div>
      </div>

    </div>
  );
}