import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '../utils/auth'; // Function that retrieves the auth token

const API_URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql"; // Your API endpoint

// Create the GraphQL HTTP link
const httpLink = createHttpLink({
    uri: API_URL,
});

// Middleware to attach Authorization headers to every GraphQL request
const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
            'Content-Type': 'application/json'
        }
    };
});

// Create Apollo Client
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
