import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import XPChart from './XPChart';
import XPBarChart from './XPBarChart';
import AuditRatio from './AuditRatio';
import { removeToken } from '../utils/auth';
import '../styles/Profile.css';

// GraphQL Query
const GET_USER_INFO = gql`
    query {
        user {
            id
            login
            email
            firstName
            lastName
            auditRatio
            transactions(
                where: { 
                    type: { _eq: "xp" }, 
                    _or: [{ attrs: { _eq: {} } }, { attrs: { _has_key: "group" } }],
                    _and: [
                        { path: { _nlike: "%/piscine-js/%" } }, 
                        { path: { _nlike: "%/piscine-go/%" } }
                    ]
                }
            ) {
                amount
                createdAt
                path
            }
        }
        xp_aggregate: transaction_aggregate(
            where: {
                type: { _eq: "xp" }
                event: { path: { _eq: "/bahrain/bh-module" } }
            }
        ) {
            aggregate {
                sum {
                    amount
                }
            }
        }
    }
`;

function Profile() {
    const navigate = useNavigate();
    const { data, loading, error } = useQuery(GET_USER_INFO);

    useEffect(() => {
        if (error && error.message.includes('unauthorized')) {
            removeToken();
            navigate('/');
        }
    }, [error, navigate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading profile: {error.message}</p>;

    const user = data?.user?.[0];

    if (!user) return <p>No user data found.</p>;

    // Calculate Total XP
    const totalXP = Math.round((data?.xp_aggregate?.aggregate?.sum?.amount || 0) / 1000);
    const formattedXP = `${totalXP} kB`;

    return (
        <div className="profile-container">
            {/* 🔹 Student Information Card */}
            <div className="student-card">
                <img src={`https://robohash.org/${user.login}.png`} alt="Profile" className="profile-image" />
                <h1>{user.firstName} {user.lastName}</h1>
                <p><strong>Username:</strong> {user.login}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            {/* 🔹 Stats Grid (XP & Audit Ratio) */}
            <div className="stats-container">
                <div className="stats-box">
                    <h2>Total XP</h2>
                    <p>{formattedXP}</p>
                </div>
                <div className="stats-box audit-box">
                    <AuditRatio auditRatio={user.auditRatio} />
                </div>
            </div>

            {/* 🔹 SVG XP Charts */}
            <div className="svg-chart">
                <XPChart transactions={user.transactions} />
            </div>
            <div className="svg-chart">
                <XPBarChart />
            </div>

            {/* 🔹 Logout Button */}
            <button className="logout-button" onClick={() => { removeToken(); navigate('/'); }}>
                Logout
            </button>
        </div>
    );
}

export default Profile;
