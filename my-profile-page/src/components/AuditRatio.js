import React from 'react';
import { useQuery, gql } from '@apollo/client';
import '../styles/AuditRatio.css';

const GET_AUDIT_RATIO = gql`
  query GetAuditRatio {
    user {
      auditRatio
      transactions(where: { type: { _eq: "audit" } }) {
        amount
        path
      }
    }
  }
`;

function AuditRatio() {
    const { data, loading, error } = useQuery(GET_AUDIT_RATIO);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    const user = data?.user?.[0];

    if (!user || !user.transactions) return <p>No data available</p>;

    // Filter transactions correctly
    const doneTransactions = user.transactions.filter(t => t.path && t.path.includes("done"));
    const receivedTransactions = user.transactions.filter(t => t.path && t.path.includes("received"));

    // Calculate amounts safely
    const done = doneTransactions.length > 0 ? doneTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
    const received = receivedTransactions.length > 0 ? receivedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;

    // Avoid division by zero
    const total = done + received;
    const donePercentage = total > 0 ? (done / total) * 100 : 0;
    const receivedPercentage = total > 0 ? (received / total) * 100 : 0;

    return (
        <div className="audit-ratio-container">
            <h2>Audits Ratio</h2>
            <div className="audit-bars">
                <div className="bar done">
                    <span>Done</span>
                    <div className="progress white" style={{ width: `${donePercentage}%` }}></div>
                    <span>{done.toFixed(2)} MB ↑</span>
                </div>
                <div className="bar received">
                    <span>Received</span>
                    <div className="progress orange" style={{ width: `${receivedPercentage}%` }}></div>
                    <span>{received.toFixed(2)} MB ↓</span>
                </div>
            </div>
            <div className="audit-score">
                <h1>{user.auditRatio ? user.auditRatio.toFixed(1) : "N/A"}</h1>
                <p className={user.auditRatio >= 1 ? 'positive' : 'negative'}>
                    {user.auditRatio >= 1 ? "Good balance!" : "Make more audits!"}
                </p>
            </div>
        </div>
    );
}

export default AuditRatio;
