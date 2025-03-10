import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient'; // Import the Apollo Client instance

// Apollo Provider Wrapper Component
const ApolloProviderWrapper = ({ children }) => (
    <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
);

export { ApolloProviderWrapper };
