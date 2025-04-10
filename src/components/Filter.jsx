import React from 'react';

const Filter = ({ selectedMonth, onMonthChange }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        htmlFor="month"
        style={{
          fontWeight: 'bold',
          marginRight: '10px',
          fontSize: '1rem',
        }}
      >
        Filter by Month:
      </label>
      <select
        id="month"
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: '#f7f7f7',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: '0.3s ease',
        }}
      >
        <option value="all">All</option>
        <option value="0">January</option>
        <option value="1">February</option>
        <option value="2">March</option>
        <option value="3">April</option>
        <option value="4">May</option>
        <option value="5">June</option>
        <option value="6">July</option>
        <option value="7">August</option>
        <option value="8">September</option>
        <option value="9">October</option>
        <option value="10">November</option>
        <option value="11">December</option>
      </select>
    </div>
  );
};

export default Filter;
