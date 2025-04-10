import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Chart from './components/Chart';
import Filter from './components/Filter';
import MonthlyReportCard from './components/MonthlyReportCard';
import { getAuth, signOut } from 'firebase/auth';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import BudgetWatcher from './components/BudgetWatcher';


const themes = {
  light: {
    '--bg-color': '#ffffff',
    '--text-color': '#000000',
    '--accent-color': '#007bff',
    '--card-bg': '#f9f9f9',
    '--border-color': '#ccc',
    '--alert-bg': '#f8d7da',
    '--alert-text': '#d9534f',
  },
  dark: {
    '--bg-color': '#121212',
    '--text-color': '#f0f0f0',
    '--accent-color': '#bb86fc',
    '--card-bg': '#1e1e1e',
    '--border-color': '#444',
    '--alert-bg': '#3c0d0d',
    '--alert-text': '#ff4f4f',
  },
};

const App = () => {
  const auth = getAuth();

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [month, setMonth] = useState('all');
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem('budget');
    return savedBudget ? parseFloat(savedBudget) : 10000;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alertSent, setAlertSent] = useState(false);

  const filteredExpenses =
    month === 'all'
      ? expenses
      : expenses.filter((e) => new Date(e.date).getMonth() === Number(month));

  const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // ✅ Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budget', budget);
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    const themeStyles = themes[theme];
    for (let key in themeStyles) {
      root.style.setProperty(key, themeStyles[key]);
    }
  }, [theme]);

  // ✅ Recurring expenses
  useEffect(() => {
    const lastCheck = localStorage.getItem('lastRecurringCheck');
    const today = new Date().toISOString().slice(0, 10);

    if (lastCheck !== today) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const newRecurring = expenses
        .filter((e) => e.isRecurring)
        .map((exp) => {
          const alreadyExists = expenses.find((e) => {
            const d = new Date(e.date);
            return e.title === exp.title && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          });
          if (alreadyExists) return null;
          return {
            ...exp,
            id: Date.now() + Math.random(),
            date: today,
          };
        })
        .filter(Boolean);

      if (newRecurring.length > 0) setExpenses((prev) => [...newRecurring, ...prev]);

      localStorage.setItem('lastRecurringCheck', today);
    }
  }, []);

  // ✅ Get user phone number from Firestore
  useEffect(() => {
    const fetchPhone = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPhoneNumber(data.phone || '');
          console.log("📞 Phone number loaded from Firestore:", data.phone);
        }
      }
    };
    fetchPhone();
  }, []);

  // ✅ WhatsApp Alert
  const sendWhatsappAlert = async () => {
    console.log("📲 sendWhatsappAlert() called");
    console.log("📤 Sending to phone number:", phoneNumber);
    if (!phoneNumber) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          message: `⚠️ Alert! You've used over 90% of your monthly budget ₹${budget}.`,
        }),
      });

      const result = await res.json();
      console.log("✅ WhatsApp Response:", result);
    } catch (err) {
      console.error("❌ Error sending WhatsApp alert:", err);
    }
  };

  // ✅ Trigger alert when budget exceeds 90%
  useEffect(() => {
    console.log("📊 useEffect triggered");
    console.log("💰 Budget:", budget, "🧾 Total:", total, "📱 Phone:", phoneNumber);
    console.log("🔁 alertSent:", alertSent);

    if (!alertSent && total >= budget * 0.9 && total < budget * 1.1) {
      console.log("🚨 90% Budget reached. Sending alert...");
      sendWhatsappAlert();
      setAlertSent(true);
    }

    if (total < budget * 0.9 && alertSent) {
      setAlertSent(false);
      console.log("✅ Resetting alertSent");
    }
  }, [total, budget, alertSent, phoneNumber]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert('Logged out successfully!');
        window.location.href = '/';
      })
      .catch((err) => alert('Logout failed: ' + err.message));
  };

  const addExpense = (expense) => setExpenses((prev) => [expense, ...prev]);
  const deleteExpense = (id) => setExpenses(expenses.filter((e) => e.id !== id));
  const editExpense = (updated) => {
    const updatedList = expenses.map((e) => (e.id === updated.id ? updated : e));
    setExpenses(updatedList);
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Amount', 'Date', 'Category'];
    const rows = filteredExpenses.map((exp) => [
      `"${exp.title}"`,
      `"${exp.amount}"`,
      `"${new Date(exp.date).toLocaleDateString()}"`,
      `"${exp.category || 'Uncategorized'}"`,
    ]);
    const content = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sharedInputStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    minWidth: '160px',
    height: '38px',
    fontSize: '14px',
    color: 'var(--text-color)',
    backgroundColor: 'var(--bg-color)',
  };

  const buttonStyle = {
    padding: '8px 14px',
    backgroundColor: 'var(--accent-color)',
    color: 'var(--bg-color)',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    height: '38px',
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh' }}>
      <Header />

      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Monthly Budget:</label>
              <input type="number" value={budget} onChange={(e) => setBudget(parseFloat(e.target.value))} style={sharedInputStyle} />
            </div>
            <div style={{ height: '38px' }}>
              <Filter selectedMonth={month} onMonthChange={setMonth} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Theme:</label>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                style={{
                  ...buttonStyle,
                  borderRadius: '30px',
                  minWidth: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transform: theme === 'dark' ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: theme === 'dark'
                    ? '0 4px 12px rgba(187, 134, 252, 0.4)'
                    : '0 4px 12px rgba(0, 123, 255, 0.3)',
                }}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={exportToCSV} style={buttonStyle}>⬇ Export to CSV</button>
            <button onClick={handleLogout} style={buttonStyle}>🚪 Logout</button>
          </div>
        </div>

        {total > budget && (
          <div style={{ color: 'var(--alert-text)', fontWeight: 'bold', backgroundColor: 'var(--alert-bg)', padding: '10px', borderRadius: '6px' }}>
            ⚠ You've exceeded your ₹{budget.toLocaleString()} monthly budget!
          </div>
        )}
      </div>

      <div style={{ display: 'flex', padding: '1rem', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <ExpenseForm onAddExpense={addExpense} />
          <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} onEdit={editExpense} />
        </div>
        <div style={{ flex: 1, background: 'var(--card-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ textAlign: 'center' }}>Spending Chart</h2>
          <Chart data={filteredExpenses} theme={theme} />
        </div>
      </div>
      <BudgetWatcher total={total} budget={budget} />

      <div style={{ padding: '1rem' }}>
        <MonthlyReportCard expenses={filteredExpenses} budget={budget} />
      </div>
    </div>
  );
};

export default App;
