import { useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

const BudgetWatcher = ({ totalExpense, budget }) => {
  useEffect(() => {
    const threshold = 0.9; // 90%
    const auth = getAuth();

    const sendWhatsappAlert = async () => {
      try {
        const functions = getFunctions();
        const sendWhatsapp = httpsCallable(functions, "sendWhatsapp");
        const res = await sendWhatsapp();
        console.log("✅ WhatsApp alert sent:", res.data.message);
      } catch (err) {
        console.error("❌ WhatsApp alert failed:", err.message);
      }
    };

    if (auth.currentUser && totalExpense >= threshold * budget) {
      sendWhatsappAlert();
    }
  }, [totalExpense, budget]);

  return null;
};

export default BudgetWatcher;
