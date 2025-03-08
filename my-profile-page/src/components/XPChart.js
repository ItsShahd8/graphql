import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const XPChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <p style={{ color: 'white', textAlign: 'center' }}>No XP data available.</p>;
  }

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Format data for the chart
  const chartData = sortedTransactions.map((tx) => ({
    date: new Date(tx.createdAt).toLocaleDateString(),
    xp: tx.amount,
  }));

  return (
    <div className="chart-container">
      <h3>XP Progress Over Time</h3>
      <ResponsiveContainer width="95%" height={400}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7f5af0" />
              <stop offset="100%" stopColor="#5a4fcf" />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" stroke="#aaa" tick={{ fontSize: 12 }} />
          <YAxis stroke="#aaa" tick={{ fontSize: 12 }} />
          <Tooltip />
          
          {/* Gradient XP Line */}
          <Line
            type="monotone"
            dataKey="xp"
            stroke="url(#xpGradient)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'white', stroke: '#7f5af0', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: 'white', stroke: '#5a4fcf', strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPChart;
