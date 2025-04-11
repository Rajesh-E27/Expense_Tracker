import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const BudgetWatcher = ({ totalExpense, budget }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  useEffect(() => {
    const threshold = 0.9;
    const auth = getAuth();

    const sendWhatsappAlert = async (phoneNumber) => {
      try {
        const functions = getFunctions();
        const sendWhatsapp = httpsCallable(functions, "sendWhatsapp");
        const res = await sendWhatsapp({
          phoneNumber,
          message: `⚠️ Alert! You've used over 90% of your monthly budget ₹${budget}.`,
        });
        console.log("✅ WhatsApp alert sent:", res.data.message);
      } catch (err) {
        console.error("❌ WhatsApp alert failed:", err.message);
      }
    };

    const checkAndSend = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const { phone } = userSnap.data();
          const crossed = totalExpense >= threshold * budget;

          if (phone && crossed && !alertSent) {
            setShowAlert(true);
            playSound();
            await sendWhatsappAlert(phone);
            setAlertSent(true);

            // Optional: auto close after 6s
            setTimeout(() => setShowAlert(false), 6000);
          }

          if (!crossed) {
            setAlertSent(false); // reset if user drops below threshold
          }
        }
      }
    };

    const playSound = () => {
      const audio = new Audio("/sounds/alert.mp3");
      audio.play().catch((err) => console.error("🔇 Sound failed:", err));
    };

    checkAndSend();
  }, [totalExpense, budget, alertSent]);

  return (
    <>
      {showAlert && (
        <div style={overlayStyle}>
          <div style={alertBoxStyle} className="animated-alert">
            <h2>🚨 Budget Limit Warning</h2>
            <p>You’ve reached 90% of your monthly budget.</p>
            <button onClick={() => setShowAlert(false)} style={btnStyle}>
              Got It!
            </button>
          </div>

          <style>{`
            .animated-alert {
              animation: boomIn 0.5s ease-out forwards;
            }

            @keyframes boomIn {
              0% {
                opacity: 0;
                transform: scale(0.6) rotate(-15deg);
              }
              100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default BudgetWatcher;

// Inline Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const alertBoxStyle = {
  background: "linear-gradient(135deg, #ffe259, #ffa751)",
  color: "#222",
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.25)",
  textAlign: "center",
  maxWidth: "420px",
  width: "90%",
  fontFamily: "'Poppins', sans-serif",
};

const btnStyle = {
  marginTop: "1.5rem",
  padding: "10px 24px",
  fontWeight: "600",
  backgroundColor: "#ff3e3e",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1rem",
};
