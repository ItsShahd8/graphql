import React from 'react';
import { useQuery, gql } from '@apollo/client';
import '../styles/AuditRatio.css';

const GET_AUDIT_RATIO = gql`
  query GetAuditRatio {
    user {
      totalUp
      totalDown
    }
  }
`;

function AuditRatio() {
    const { data, loading, error } = useQuery(GET_AUDIT_RATIO);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    const user = data?.user?.[0];

    if (!user) return <p>No data available</p>;

    // Formatting function
    function formatBytes(bytes, precision = 2) {
        let units = ["B", "kB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 B";
        let exponent = Math.floor(Math.log(bytes) / Math.log(1000));
        let value = (bytes / Math.pow(1000, exponent)).toFixed(precision);
        return `${value} ${units[exponent]}`;
    }

    const done = user.totalUp || 0;
    const received = user.totalDown || 0;

    const total = done + received;
    const donePercentage = total > 0 ? (done / total) * 100 : 0;
    const receivedPercentage = total > 0 ? (received / total) * 100 : 0;

    // Calculate audit ratio
    const auditRatio = received > 0 ? done / received : done > 0 ? done : 0;

    return (
        <div className="audit-ratio-container">
            <h2>Audits Ratio</h2>
            <div className="audit-bars">
                <div className="bar-container">
                    <span className="label">Done</span>
                    <div className="progress-container">
                        <div className="progress done-bar" style={{ width: `${donePercentage}%` }}></div>
                    </div>
                    <span className="value">{formatBytes(done)} ↑</span>
                </div>
                <div className="bar-container">
                    <span className="label">Received</span>
                    <div className="progress-container">
                        <div className="progress received-bar" style={{ width: `${receivedPercentage}%` }}></div>
                    </div>
                    <span className="value">{formatBytes(received)} ↓</span>
                </div>
            </div>
            <div className="audit-score">
                <h1>{auditRatio ? auditRatio.toFixed(2) : "N/A"}</h1>
                <p className={auditRatio >= 1 ? 'positive' : 'negative'}>
                    {auditRatio >= 1 ? "Good balance!" : "Make more audits!"}
                </p>
            </div>
        </div>
    );
}

export default AuditRatio;
