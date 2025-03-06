import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import XPChart from './XPChart'; // Create this file for the graph

const GET_USER_INFO = gql`
    query {
        user {
            id
            login
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
        if (error && (error.message.includes('unauthorized') || error.message.includes('JWT'))) {
            localStorage.removeItem('jwt');
            navigate('/');
        }
    }, [error, navigate]);

    if (loading) return <p>Loading your profile...</p>;
    if (error) return <p>Error loading your profile: {error.message}</p>;

    const user = data?.user?.[0];

    if (!user) {
        return <p>No user data found.</p>;
    }

    const passedProjects = user.progresses.filter(p => p.grade === 1).length;
    const failedProjects = user.progresses.filter(p => p.grade === 0).length;

    const calculateSkills = (progresses) => {
        const skills = {
            "Frontend": 0,
            "Backend": 0,
            "Algorithms": 0,
            "DevOps": 0
        };

        progresses.forEach(progress => {
            if (progress.path.includes("js") || progress.path.includes("html")) {
                skills.Frontend++;
            } else if (progress.path.includes("node") || progress.path.includes("api")) {
                skills.Backend++;
            } else if (progress.path.includes("algo") || progress.path.includes("data")) {
                skills.Algorithms++;
            } else if (progress.path.includes("docker") || progress.path.includes("devops")) {
                skills.DevOps++;
            }
        });

        return skills;
    };

    const skills = calculateSkills(user.progresses);

    return (
        <div className="profile-container">
            <h1>Welcome to Your Profile</h1>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Login:</strong> {user.login}</p>

            {/* XP Chart */}
            <XPChart transactions={user.transactions} />

            {/* Grades */}
            <h2>Project Grades Summary</h2>
            <p>Total Passed Projects: {passedProjects}</p>
            <p>Total Failed Projects: {failedProjects}</p>

            {/* Skills */}
            <h2>Skills Summary</h2>
            <ul>
                {Object.entries(skills).map(([skill, count]) => (
                    <li key={skill}>{skill}: {count} projects</li>
                ))}
            </ul>

            <button onClick={() => {
                localStorage.removeItem('jwt');
                navigate('/');
            }}>Logout</button>
        </div>
    );
}

export default Profile;
