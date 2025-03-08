import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useQuery, gql } from '@apollo/client';
import '../styles/Chart.css';

// GraphQL Query to Fetch XP Data
const GET_XP_CHART_DATA = gql`
  query {
    user {
      transactions(where: {type: {_eq: "xp"}}) {
        amount
        createdAt
      }
    }
  }
`;

const XPBarChart = () => {
  const { data, loading, error } = useQuery(GET_XP_CHART_DATA);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data) {
      const groupedData = {};
      
      data.user[0].transactions.forEach(({ amount, createdAt }) => {
        const month = new Date(createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        groupedData[month] = (groupedData[month] || 0) + amount;
      });

      setChartData(Object.entries(groupedData).map(([month, totalXP]) => ({ month, totalXP })));
    }
  }, [data]);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading chart data.</p>;

  return (
    <div className="chart-container">
      <h3>XP Earned Per Month</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="xpBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7f5af0" />
              <stop offset="100%" stopColor="#5a4fcf" />
            </linearGradient>
          </defs>

          {/* Grid with smooth opacity */}
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />

          <XAxis dataKey="month" stroke="#ddd" tick={{ fontSize: 12 }} />
          <YAxis stroke="#ddd" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: "#222", borderRadius: "8px", border: "1px solid #555" }} />
          
          {/* Stylish Bars */}
          <Bar
            dataKey="totalXP"
            fill="url(#xpBarGradient)"
            barSize={30}
            radius={[10, 10, 0, 0]} // Rounded corners
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPBarChart;
