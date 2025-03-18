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
    
      // Clearly fix this line exactly:
      const credentials = `${login.trim()}:${password.trim()}`; // <-- `.trim()` removes extra spaces
      const encodedCredentials = `Basic ${btoa(credentials)}`;
    
      console.log("🔍 Sending credentials:", credentials);
      console.log("🔍 Encoded (Base64):", encodedCredentials);
    
      try {
        const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
          method: 'POST',
          headers: {
            'Authorization': encodedCredentials,
          },
        });
    
        const responseText = await response.text();
    
        if (!response.ok) {
          throw new Error(`Login failed: ${responseText}`);
        }
    
        const token = responseText.replace(/"/g, '');
        saveToken(token);
        navigate('/profile');
    
      } catch (error) {
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
