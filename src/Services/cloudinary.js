export async function uploadImage(file) {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "retrivo_unsigned");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dvuv944bh/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}