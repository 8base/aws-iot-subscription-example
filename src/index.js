import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { SubscriptionClientLink } from "@8base/sdk";


const authMiddleware = new ApolloLink((operation, forward) => {
  let headers = {};

  if (localStorage.getItem("idToken")) {
    headers.Authorization = localStorage.getItem("idToken")
  }

  if (localStorage.getItem("account-id")) {
    headers["account-id"] = localStorage.getItem("account-id")
  }

  operation.setContext( { headers });

  return forward(operation);
});

const link = ApolloLink.from([
  authMiddleware,
  new SubscriptionClientLink(),
  new BatchHttpLink({ uri: "" })
]);
  

const cache = new InMemoryCache(/*{ fragmentMatcher }*/);

const client = new ApolloClient({
    cache,
    link
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, document.getElementById('root')
)

registerServiceWorker();
