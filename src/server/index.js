const express = require('express');
const cors = require('cors');
const sendWhatsappMessage = require('./sendWhatsapp');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-whatsapp', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const sid = await sendWhatsappMessage(phoneNumber, message);
    res.status(200).json({ success: true, sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
