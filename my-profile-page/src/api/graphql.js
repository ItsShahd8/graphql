import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '../utils/auth';

const httpLink = createHttpLink({
    uri: 'https://learn.reboot01.com/api/graphql-engine/v1/graphql'
});

const authLink = setContext(() => {
    const token = getToken();
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
