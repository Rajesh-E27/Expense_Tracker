import React from 'react';

const categoryColors = {
  Bills: '#FFB6C1',       // Light Pink
  Transport: '#ADD8E6',   // Light Blue
  Food: '#98FB98',        // Light Green
  Entertainment: '#FFD580',
  Shopping: '#E0BBE4',
  Uncategorized: '#D3D3D3',
};

const MonthlyReportCard = ({ expenses, budget }) => {
  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const remaining = budget - totalSpent;

  const groupedByCategory = expenses.reduce((acc, expense) => {
    const cat = expense.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        color: '#333',
        maxWidth: '700px',
        margin: '2rem auto',
        transition: 'transform 0.3s ease',
      }}
    >
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        📅 <span style={{ fontWeight: '700' }}>Monthly Summary</span>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {Object.entries(groupedByCategory).map(([category, amount]) => (
          <div
            key={category}
            style={{
              backgroundColor: categoryColors[category] || '#f0f0f0',
              padding: '1rem',
              borderRadius: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontWeight: '600', marginBottom: '0.4rem', fontSize: '1rem' }}>{category}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>₹{amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: '2px solid #ccc',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}
      >
        <div>Total Spent:</div>
        <div>₹{totalSpent.toLocaleString()}</div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          marginTop: '0.5rem',
        }}
      >
        <div>Remaining Budget:</div>
        <div style={{ color: remaining < 0 ? '#e74c3c' : '#27ae60' }}>
          ₹{remaining.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportCard;
