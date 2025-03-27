import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import XPChart from './XPChart';
import XPBarChart from './XPBarChart';
import AuditRatio from './AuditRatio';
import { getToken, removeToken } from '../utils/auth';
import '../styles/Profile.css';

// GraphQL Query
// GraphQL Query
// const GET_USER_INFO = gql`
//     query {
//         user {
//             id
//             login
//             email
//             firstName
//             lastName
//             auditRatio
//             transactions(
//                 where: {
//                     type: { _eq: "xp" },
//                     _and: [
//                         { path: { _nlike: "%/piscine-js/%" } },
//                         { path: { _nlike: "%/piscine-go/%" } }
//                     ]
//                 }
//             ) {
//                 amount
//                 createdAt
//                 path
//             }
//         }
//         xp_aggregate: transaction_aggregate(
//             where: {
//                 type: { _eq: "xp" },
//                 event: { path: { _eq: "/bahrain/bh-module" } }
//             }
//         ) {
//             aggregate {
//                 sum {
//                     amount
//                 }
//             }
//         }
//     }
// `;

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
                    _and: [
                        { path: { _nlike: "%/piscine-js/%" } },
                        { path: { _nlike: "%/piscine-go/%" } }
                    ]
                }
            )
        {
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


// ✅ Keep your old XP formatting function
function formatBytes(bytes) {
    let units = ["B", "kB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";

    let exponent = Math.floor(Math.log(bytes) / Math.log(1000));
    let value = Math.round(bytes / Math.pow(1000, exponent)); // Rounds to whole number

    return `${value} ${units[exponent]}`;
}

function Profile() {
    const navigate = useNavigate();
    const token = getToken();

    // 🚀 Redirect to `/login` if no token is found
    useEffect(() => {
        if (!token) {
            console.log("🔴 No token found, redirecting to login...");
            navigate("/");
        }
    }, [token, navigate]); // ✅ Ensures correct token check

    // 🚀 Disable Webpack HMR when navigating to `/profile`
    useEffect(() => {
        if (import.meta.webpackHot) {
            console.log("🔥 Disabling HMR on Profile Page...");
            import.meta.webpackHot.dispose(() => {
                window.location.reload(); // ✅ Forces full reload to disable HMR
            });
        }
    }, []);

    const { data, loading, error } = useQuery(GET_USER_INFO, {
        skip: !token, // ✅ Prevents GraphQL query if user is not logged in
    });

    if (!token) return <p>Please log in.</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading profile: {error.message}</p>;

    const user = data?.user?.[0];
    if (!user) return <p>No user data found.</p>;
    
    // console.log("🧪 All Transaction Paths:");
    // user.transactions.forEach(t => console.log(t.path));
    
    let rawXP = data?.xp_aggregate?.aggregate?.sum?.amount || 0;

    // Debugging output
    console.log("🔹 Raw XP before formatting:", rawXP);

    return (
        <div className="profile-container">
            {/* 🔹 Student Information Card */}
            <div className="student-card">
                <img
                    src={`https://robohash.org/${user.login}.png`}
                    alt="Profile"
                    className="profile-image"
                />
                <h1>
                    {user.firstName} {user.lastName}
                </h1>
                <p><strong>Username:</strong> {user.login}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            {/* 🔹 Stats Wrapper (XP Total & Audit Ratio side by side) */}
            <div className="stats-wrapper">
                <div className="stats-box">
                    <h2>Total XP</h2>
                    <p>{formatBytes(rawXP)}</p> {/* ✅ Uses your original XP formatting */}
                </div>
                <div className="audit-box">
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
            <button
                className="logout-button"
                onClick={() => {
                    removeToken();
                    navigate("/");
                }}
            >
                Logout
            </button>
        </div>
    );
}

export default Profile;
