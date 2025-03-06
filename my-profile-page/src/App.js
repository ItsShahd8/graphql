import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Profile from './components/Profile';

// GraphQL endpoint
const httpLink = createHttpLink({
    uri: 'https://learn.reboot01.com/api/graphql-engine/v1/graphql'
});

// Automatically add JWT token from localStorage to every request
const authLink = setContext(() => {
    const token = localStorage.getItem('jwt');
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

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
