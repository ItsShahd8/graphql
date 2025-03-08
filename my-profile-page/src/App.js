import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { client } from './api/graphql';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;
