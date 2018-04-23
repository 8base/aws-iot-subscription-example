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

const idToken = "";

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext( {
      headers: {
        'authorization': idToken,
        'account-id': ""
    }
  });

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
