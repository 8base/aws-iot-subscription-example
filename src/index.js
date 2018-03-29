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


import { SubscriptionEnvironment } from "aws-iot-subscription-client";


const idToken = "";

const cloudClient = SubscriptionEnvironment.CloudClient( {
  transport: SubscriptionEnvironment.Transport.Iot({
    region: "",
    iotEndpoint: "",
    debug: false
  }),
  resolver: SubscriptionEnvironment.Auth.Cognito({
    region: "",
    identityPoolId: "",
    userPoolId: ""
  })
})

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext( {
      headers: {
        'token': idToken,
        'authorization': "master",
        'account-id': ""
    }
  });

  return forward(operation);
});

const link = ApolloLink.from([
  authMiddleware,
  SubscriptionEnvironment.ClientApolloLink(cloudClient),
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
