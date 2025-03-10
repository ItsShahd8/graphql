import React from 'react';
import { ApolloProviderWrapper } from './apollo/ApolloProvider'; // Ensure correct import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';     // ✅ Fix import path
import Profile from './components/Profile'; // ✅ Fix import path

function App() {
    return (
        <ApolloProviderWrapper>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Router>
        </ApolloProviderWrapper>
    );
}

export default App;
