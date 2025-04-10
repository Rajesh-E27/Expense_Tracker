import React, { useState } from 'react';

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (expense) => {
    setEditId(expense.id);
    setEditData({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0], // format for input[type=date]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSave = () => {
    if (editData.title && editData.amount && editData.date) {
      onEdit({ ...editData });
      setEditId(null);
    }
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', color: 'var(--text-color)' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
          <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Title</th>
          <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Amount</th>
          <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Date</th>
          <th style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center', padding: '16px' }}>
              No expenses found.
            </td>
          </tr>
        ) : (
          expenses.map((expense, index) => (
            <tr
              key={expense.id}
              style={{
                backgroundColor: index % 2 === 0 ? 'var(--row-even-bg)' : 'var(--row-odd-bg)',
                height: '60px',
              }}
            >
              <td style={{ padding: '12px 8px' }}>
                {editId === expense.id ? (
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleChange}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                ) : (
                  expense.title
                )}
              </td>
              <td style={{ padding: '12px 8px' }}>
                {editId === expense.id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleChange}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                ) : (
                  `₹ ${expense.amount}`
                )}
              </td>
              <td style={{ padding: '12px 8px' }}>
                {editId === expense.id ? (
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleChange}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                ) : (
                  new Date(expense.date).toLocaleDateString()
                )}
              </td>
              <td style={{ padding: '12px 8px' }}>
                {editId === expense.id ? (
                  <>
                    <button onClick={handleSave} style={{ marginRight: '6px' }}>💾</button>
                    <button onClick={() => setEditId(null)}>❌</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(expense)} style={{ marginRight: '6px' }}>✏️</button>
                    <button onClick={() => onDelete(expense.id)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ExpenseList;
