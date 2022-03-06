import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css'; // Ensure consistent layout across browsers
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/core';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CollectionsProvider } from './contexts/CollectionsContext';
import { SearchProvider } from './contexts/SearchContext';
import AuthProvider from './auth/AuthProvider';
import getAuthToken from './auth/getAuthToken';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:5000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <SearchProvider>
        <CollectionsProvider>
          <App />
        </CollectionsProvider>
      </SearchProvider>
    </AuthProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
