import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="title" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#38bdf8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
