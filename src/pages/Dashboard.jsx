// File: pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchExpensesForUser } from '../services/expenseService';
import { auth } from '../firebase/config';
import MonthlyReportCard from '../components/MonthlyReportCard';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(10000);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await fetchExpensesForUser(user.uid);
        setExpenses(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {auth.currentUser?.email}!</h1>
      <MonthlyReportCard expenses={expenses} budget={budget} />
    </div>
  );
};

export default Dashboard;