import { useState } from "react";
import Navbar from "../Components/Navbar";
import { db } from "../Services/Firebase";
import { ref, push, get } from "firebase/database";
import { uploadImage } from "../Services/cloudinary";
import { sendConfirmationEmail } from "../Services/email";

export default function Found() {
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

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageURL = "";

      // upload image if exists
      if (image) {
        imageURL = await uploadImage(image);
      }

      // 1️⃣ Save found item
      const foundRef = ref(db, "foundItems");
      const newFound = await push(foundRef, {
        ...form,
        itemName: form.itemName.trim(),
        location: form.location.trim(),
        imageURL,
        timestamp: Date.now(),
      });

      // 2️⃣ Match against lost items
      const lostSnap = await get(ref(db, "lostItems"));

      if (lostSnap.exists()) {
        const lostData = lostSnap.val();

        Object.entries(lostData).forEach(([id, lost]) => {
          if (
            lost.itemName?.trim().toLowerCase() ===
              form.itemName.trim().toLowerCase() &&
            lost.location?.trim().toLowerCase() ===
              form.location.trim().toLowerCase()
          ) {
            // confirmation link
           const confirmLink =`${window.location.origin}/confirm?lost=${id}&found=${newFound.key}`;

            // send email
            sendConfirmationEmail({
              toEmail: lost.email,
              itemName: lost.itemName,
              location: lost.location,
              finderName: form.personName,
              confirmLink,
            });
          }
        });
      }

      alert("🎉 Found item submitted successfully!");

      // reset form
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
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">

          <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
            Report Found Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="personName"
              value={form.personName}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border rounded-lg p-3"
            />

            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Student</option>
              <option>Professor</option>
              <option>Guard</option>
              <option>Other Staff</option>
            </select>

            <input
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              placeholder="Item Name"
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="date"
              name="foundDate"
              value={form.foundDate}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location Found"
              required
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition"
            >
              {loading ? "Submitting..." : "Submit Found Item"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}