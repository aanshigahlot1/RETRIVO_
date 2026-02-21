import emailjs from "@emailjs/browser";

// 🔑 EmailJS Public Key
emailjs.init("4SAbTljPHoGzrgg_Z");

export async function sendConfirmationEmail({
  toEmail,
  itemName,
  location,
  finderName,
  confirmLink,
}) {
  try {
    await emailjs.send(
      "service_6gpd5bx",   // service ID
      "template_hs1cwrk",  // template ID
      {
        to_email: toEmail,
        lost_item: itemName,
        lost_location: location,
        found_person: finderName,
        confirm_link: confirmLink,
      }
    );

    console.log("Email sent successfully");
  } catch (error) {
    console.error("EmailJS Error:", error);
  }
}