require('dotenv').config(); // 👈 Add this line at the top

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsapp = process.env.TWILIO_WHATSAPP_FROM;

const client = require('twilio')(accountSid, authToken);

const sendWhatsappMessage = async (to, body) => {
  try {
    const message = await client.messages.create({
      from: fromWhatsapp,
      to: `whatsapp:${to}`,
      body,
    });
    console.log('Message sent:', message.sid);
    return message.sid;
  } catch (err) {
    console.error('Error sending message:', err);
    throw err;
  }
};

module.exports = sendWhatsappMessage;




