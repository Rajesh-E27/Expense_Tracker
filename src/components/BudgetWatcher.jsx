import { useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // ✅ make sure this path is correct

const BudgetWatcher = ({ totalExpense, budget }) => {
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
          if (phone && totalExpense >= threshold * budget) {
            await sendWhatsappAlert(phone);
          }
        }
      }
    };

    checkAndSend();
  }, [totalExpense, budget]);

  return null;
};

export default BudgetWatcher;
