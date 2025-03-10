import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import XPChart from './XPChart';
import XPBarChart from './XPBarChart';
import { removeToken } from '../utils/auth';
import '../styles/Profile.css';

// GraphQL Query with Missing Data Included
// Update the GraphQL query to match the correct XP calculation
const GET_USER_INFO = gql`
    query {
        user {
            id
            login
            email
            firstName
            lastName
            auditRatio
            progresses {
                objectId
                grade
                path
                object {
                    name
                    type
                }
            }
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
                    <p>{formattedXP}</p>
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
