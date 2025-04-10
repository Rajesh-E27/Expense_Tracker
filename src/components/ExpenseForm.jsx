import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './ExpenseForm.css';

const ExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to add an expense.');
      return;
    }

    const newExpense = {
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      isRecurring: false,
    };

    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "expenses"), newExpense);
     // onAddExpense({ id: docRef.id, ...newExpense });
    } catch (error) {
      console.error("❌ Failed to add expense:", error);
      alert("Failed to add expense. Please try again.");
    }

    setTitle('');
    setAmount('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Expense title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
          minWidth: '200px',
          flex: 1,
        }}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
          minWidth: '120px',
        }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        style={{
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
          minWidth: '160px',
        }}
      >
        <option value="">Select Category</option>
        <option value="Food">🍔 Food</option>
        <option value="Transport">🚌 Transport</option>
        <option value="Shopping">🛍️ Shopping</option>
        <option value="Entertainment">🎮 Entertainment</option>
        <option value="Bills">💡 Bills</option>
        <option value="Other">🔧 Other</option>
      </select>

      <button
        type="submit"
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 18px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
