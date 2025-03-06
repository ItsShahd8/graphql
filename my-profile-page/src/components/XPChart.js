import React from 'react';

function XPChart({ transactions }) {
    if (transactions.length === 0) {
        return <p>No XP data available.</p>;
    }

    // Prepare points for SVG polyline
    const points = transactions.map((tx, index) => {
        const x = index * 30;  // space out points horizontally
        const y = 200 - tx.amount / 100; // scale XP to fit SVG height (adjust scaling if needed)
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="xp-chart">
            <h3>XP Progress Over Time</h3>
            <svg width="600" height="200" style={{ border: '1px solid black', margin: '10px 0' }}>
                <polyline
                    fill="none"
                    stroke="blue"
                    strokeWidth="2"
                    points={points}
                />
                {transactions.map((tx, index) => (
                    <text key={index} x={index * 30} y="190" fontSize="10" fill="black">
                        {new Date(tx.createdAt).toLocaleDateString()}
                    </text>
                ))}
            </svg>
        </div>
    );
}

export default XPChart;
