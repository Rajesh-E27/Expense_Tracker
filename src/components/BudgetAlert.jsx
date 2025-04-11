import React, { useEffect } from "react";
import "./../styles/BudgetAlert.css"; // ✅ correct CSS path

const BudgetAlert = ({ onClose }) => {
  useEffect(() => {
    const audio = new Audio("/sounds/alert.mp3");
    audio.play().catch((err) => {
      console.error("❌ Failed to play alert sound:", err);
    });
  }, []);

  return (
    <div className="budget-alert-overlay" onClick={onClose}>
      <div className="budget-alert-box">
        <h2>⚠️ Budget Limit Alert!</h2>
        <p>You’ve reached 90% of your monthly budget.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BudgetAlert;
