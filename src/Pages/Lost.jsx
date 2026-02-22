import { useState } from "react";
import Navbar from "../Components/Navbar";
import { db } from "../Services/Firebase";
import { ref, push } from "firebase/database";
import { uploadImage } from "../Services/cloudinary";

export default function Lost() {
  const [form, setForm] = useState({
    personName: "",
    userType: "Student",
    itemName: "",
    lostDate: "",
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

      // upload image to cloudinary
      if (image) {
        imageURL = await uploadImage(image);
      }

      // save lost item in firebase
      await push(ref(db, "lostItems"), {
        ...form,
        itemName: form.itemName.trim(),
        location: form.location.trim(),
        imageURL,
        timestamp: Date.now(),
      });

      alert("📦 Lost item submitted successfully!");

      // reset form
      setForm({
        personName: "",
        userType: "Student",
        itemName: "",
        lostDate: "",
        location: "",
        description: "",
        email: "",
        phone: "",
      });

      setImage(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting lost item.");
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
            Report Lost Item
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
              name="lostDate"
              value={form.lostDate}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location Lost"
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
              {loading ? "Submitting..." : "Submit Lost Item"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}