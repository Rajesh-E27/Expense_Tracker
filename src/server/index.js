const express = require('express');
const cors = require('cors');
const sendWhatsappMessage = require('./sendWhatsapp');

const app = express();

// ✅ Enable CORS for localhost and your deployed frontend (if any)
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-url.com'], // Replace with your actual frontend domain if deployed
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// ✅ WhatsApp endpoint
app.post('/api/send-whatsapp', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const sid = await sendWhatsappMessage(phoneNumber, message);
    res.status(200).json({ success: true, sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Root route to test backend is live
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
