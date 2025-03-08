import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import XPChart from './XPChart';
import XPBarChart from './XPBarChart';
import { removeToken } from '../utils/auth';
import '../styles/Profile.css';

const GET_USER_INFO = gql`
    query {
        user {
            id
            login
            email
            firstName
            lastName
            transactions(where: {type: {_eq: "xp"}}) {
                amount
                createdAt
            }
            progresses {
                objectId
                grade
                path
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

    if (loading) return <div className="loading">Loading Profile...</div>;
    if (error) return <div className="error-message">Error loading profile: {error.message}</div>;

    const user = data?.user?.[0];
    if (!user) return <div className="error-message">No user data found.</div>;

    // Calculate total XP and project stats
    const totalXP = user.transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const passedProjects = user.progresses.filter(p => p.grade === 1).length;
    const failedProjects = user.progresses.filter(p => p.grade === 0).length;

    return (
        <div className="profile-container">
            {/* Student Information Card */}
            <div className="student-card">
                <img 
                    src={`https://robohash.org/${user.login}.png`} 
                    alt="Student Avatar" 
                    className="avatar"
                />
                <div className="student-info">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p><strong>Username:</strong> {user.login}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </div>

            {/* XP & Project Summary */}
            <div className="xp-summary">
                <div className="xp-card">
                    <h3>Total XP</h3>
                    <p>{totalXP} XP</p>
                </div>
                <div className="xp-card success">
                    <h3>Projects Passed</h3>
                    <p>{passedProjects}</p>
                </div>
                <div className="xp-card danger">
                    <h3>Projects Failed</h3>
                    <p>{failedProjects}</p>
                </div>
            </div>

            {/* XP Charts */}
            <XPChart transactions={user.transactions} />
            <XPBarChart />

            {/* Logout Button */}
            <button className="logout-button" onClick={() => { 
                removeToken(); 
                navigate('/'); 
            }}>
                Logout
            </button>
        </div>
    );
}

export default Profile;
