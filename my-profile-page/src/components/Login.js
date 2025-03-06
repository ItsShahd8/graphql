import React, { useState } from 'react';

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
    
        const credentials = `${login}:${password}`;
        const encodedCredentials = btoa(credentials);
    
        console.log(' Attempting login...');
        console.log(' Username:', login);
        console.log(' Password:', password);
        console.log(' Authorization Header:', `Basic ${encodedCredentials}`);
    
        try {
            const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('👉 Response status:', response.status);
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error response:', errorText);
                throw new Error('Login failed. Please check your credentials.');
            }
    
            const data = await response.json();
            console.log('Full server response:', data);
            if (!response.ok){
                throw new Error('invalid username or password');
            }
            if (data){
                localStorage.setItem('jwt', data);
                alert("Login successful");
                window.location.href = '/profile';
            }
    
            if (!data.token) {
                throw new Error('❌ No token received from server.');
            }
    
            localStorage.setItem('jwt', data.token);
            console.log('✅ Token saved to localStorage:', data.token);
    
            window.location.href = '/profile';
        } catch (error) {
            console.error('❌ Login error:', error.message);
            setError(error.message);
        }
    };
    
    

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;
