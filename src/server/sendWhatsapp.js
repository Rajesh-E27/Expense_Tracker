// Load environment variables from .env file
require('dotenv').config(); // 👈 Ensure this is at the top

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsapp = process.env.TWILIO_WHATSAPP_FROM;

const client = require('twilio')(accountSid, authToken);
if (!phoneNumber) {
  throw new Error("Phone number not found for this user.");
}

const sendWhatsappMessage = async (to, body) => {
  console.log("📤 Sending WhatsApp message to:", to);
  console.log("📝 Message content:", body); // <- this must show the actual string

  try {
    const message = await client.messages.create({
      from: fromWhatsapp,
      to: `whatsapp:${to}`,
      body,
    });

    console.log('✅ Message sent with SID:', message.sid);
    return message.sid;
  } catch (err) {
    console.error('❌ Error sending WhatsApp message:', err.message);
    throw err;
  }
};


// const sendWhatsappMessage = async (to, body) => {
//   try {
//     // ✅ Log the inputs for debug
//     console.log('📤 Sending message to:', to);
//     console.log('📝 Message content:', body);

//     const message = await client.messages.create({
//       from: fromWhatsapp,
//       to: `whatsapp:${to}`,
//       body,
//     });

//     console.log('✅ Message sent with SID:', message.sid);
//     return message.sid;
//   } catch (err) {
//     console.error('❌ Error sending WhatsApp message:', err.message);
//     throw err;
//   }
// };

module.exports = sendWhatsappMessage;
