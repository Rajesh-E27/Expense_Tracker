import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Chart from './components/Chart';
import Filter from './components/Filter';
import MonthlyReportCard from './components/MonthlyReportCard';
import BudgetWatcher from './components/BudgetWatcher';

import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  getDoc,
} from 'firebase/firestore';

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

  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState('all');
  const [budget, setBudget] = useState(() => parseFloat(localStorage.getItem('budget')) || 10000);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [phoneNumber, setPhoneNumber] = useState('');

  const filteredExpenses =
    month === 'all'
      ? expenses
      : expenses.filter((e) => new Date(e.date).getMonth() === Number(month));

  const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // 🌟 Theme & Budget Persistence
  useEffect(() => localStorage.setItem('budget', budget), [budget]);
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    const vars = themes[theme];
    for (let key in vars) root.style.setProperty(key, vars[key]);
  }, [theme]);

  // 🌟 Auth Listener & Fetch Phone/Expenses
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setPhoneNumber(userDoc.data().phone || '');
        }

        const q = query(collection(db, 'users', user.uid, 'expenses'));
        const unsubSnap = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setExpenses(list);
        });

        return () => unsubSnap();
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert('Logged out!');
      window.location.href = '/';
    });
  };

  // 🌟 Firestore Handlers
  const addExpense = async (expense) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'expenses'), expense);
  };

  const deleteExpense = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
  };

  const editExpense = async (expense) => {
    if (!user) return;
    const { id, ...rest } = expense;
    await updateDoc(doc(db, 'users', user.uid, 'expenses', id), rest);
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Amount', 'Date', 'Category'];
    const rows = filteredExpenses.map((exp) => [
      `"${exp.title}"`,
      `"${exp.amount}"`,
      `"${new Date(exp.date).toLocaleDateString()}"`,
      `"${exp.category || 'Uncategorized'}"`,
    ]);
    const content =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(content);
    link.download = 'expenses.csv';
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
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
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
                }}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={exportToCSV} style={buttonStyle}>⬇ Export</button>
            <button onClick={handleLogout} style={buttonStyle}>🚪 Logout</button>
          </div>
        </div>

        {total > budget && (
          <div style={{
            color: 'var(--alert-text)',
            fontWeight: 'bold',
            backgroundColor: 'var(--alert-bg)',
            padding: '10px',
            borderRadius: '6px'
          }}>
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

      <BudgetWatcher total={total} budget={budget} phoneNumber={phoneNumber} />

      <div style={{ padding: '1rem' }}>
        <MonthlyReportCard expenses={filteredExpenses} budget={budget} />
      </div>
    </div>
  );
};

export default App;
