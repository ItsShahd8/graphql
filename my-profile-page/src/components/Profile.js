import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import XPChart from './XPChart';
import XPBarChart from './XPBarChart';
import { removeToken } from '../utils/auth';
import '../styles/Profile.css';

// GraphQL Query with Missing Data Included
const GET_USER_INFO = gql`
    query {
        user {
            id
            login
            email
            firstName
            lastName
            auditRatio
            transactions(where: {type: {_eq: "xp"}}) {
                amount
                createdAt
            }
            progresses {
                objectId
                grade
                path
                object {
                    name
                    type
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
    const totalXP = user.transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const passedProjects = user.progresses.filter(p => p.grade === 1).length;
    const failedProjects = user.progresses.filter(p => p.grade === 0).length;

    return (
        <div className="profile-container">
            {/* 🔹 Student Information Card */}
            <div className="student-card">
                <img src={`https://robohash.org/${user.login}.png`} alt="Student Avatar" className="avatar" />
                <div className="student-info">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p><strong>Username:</strong> {user.login}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Audit Ratio:</strong> {user.auditRatio ? user.auditRatio.toFixed(2) : "N/A"}</p>
                </div>
            </div>

            {/* 🔹 XP & Project Summary (Styled Separately) */}
            <div className="stats-container">
                <div className="stats-box">
                    <h2>Total XP</h2>
                    <p>{totalXP} XP</p>
                </div>
                <div className="stats-box">
                    <h2>Projects Passed</h2>
                    <p>{passedProjects}</p>
                </div>
                <div className="stats-box">
                    <h2>Projects Failed</h2>
                    <p>{failedProjects}</p>
                </div>
            </div>

            {/* 🔹 XP Charts */}
            <XPChart transactions={user.transactions} />
            <XPBarChart />

            {/* 🔹 Logout Button */}
            <button className="logout-button" onClick={() => { removeToken(); navigate('/'); }}>
                Logout
            </button>
        </div>
    );
}

export default Profile;
