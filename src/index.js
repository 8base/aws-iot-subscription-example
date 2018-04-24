import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

import { Subscription } from "aws-iot-subscription-client";

import { SubscriptionClientLink } from "@8base/sdk";

localStorage.setItem('isLoggin', "");

const authMiddleware = new ApolloLink((operation, forward) => {
  let headers = {};

  if (localStorage.getItem("idToken")) {
    headers.idToken = localStorage.getItem("idToken")
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
  new BatchHttpLink({ uri: "http://localhost:3000" })
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
