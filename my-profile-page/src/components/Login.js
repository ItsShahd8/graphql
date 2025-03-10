import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';
import '../styles/App.css';

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
    
        const encodedCredentials = `Basic ${btoa(`${login}:${password}`)}`;
    
        console.log("🚀 Attempting login with:");
        console.log("🔑 Username:", login);
        console.log("🔑 Password:", password);
        console.log("🔑 Encoded Credentials:", encodedCredentials);
    
        try {
            const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': encodedCredentials,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("🔍 Response Status:", response.status);
    
            const responseText = await response.text();
            console.log("📡 API Response:", responseText);
    
            if (!response.ok) {
                throw new Error(`Login failed: ${responseText}`);
            }
    
            const data = JSON.parse(responseText);
            console.log("✅ Login Success! Token:", data);
    
            saveToken(data);
            navigate('/profile');
        } catch (error) {
            console.error("❌ Login Error:", error.message);
            setError(error.message);
        }
    };
    
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
