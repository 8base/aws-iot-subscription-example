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

const idToken = "eyJraWQiOiI1U0pMY3BmOE5vVFg1Z1ZCZGFTN2ZjUVd2UWdTa1RMUDRCZmZNY2ZPY3ljPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhYjY0YWJkOS0zYjNkLTQ1MzMtOWU4OS1kMjJkYTM3YWU4OGMiLCJhdWQiOiIxbHI4YnB0NmJicnU0OG91NzYwdWZjbjJ0dCIsImV2ZW50X2lkIjoiOWRmMzU2NjItMzY0YS0xMWU4LWI2YmItMGI2YmQxMTQzZDJiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MjI2NTU0NzQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0xyU1l0bGZuSCIsImNvZ25pdG86dXNlcm5hbWUiOiJldWdlbmUuYW50b25ldmljaDJAZ21haWwuY29tIiwiZXhwIjoxNTIyNjU5MDc0LCJpYXQiOjE1MjI2NTU0NzR9.kPjdJzuJeS-NXNn6v8ZKykMC7zEliZiWQA_vsf3gQ_W4TqBwvuLLOgbfj5--Rkh4HXi_1DecR0TVkYNjcDTjyrE2EdpkGvYa2rlYp1MyGqpUdgKsvuz2Tg-bKAbc0kMxWiRPWHDNgtd-gwqIfwn1E45fF33ryNih8H82nTC0IKIysSI6vnKewbu-63p1kIB3y3oXETm9fnnAV8yKou1Zzxc-MUEuVoNlvO8ExHIMkKDGOR3SaTFOo1Jg_urcrtNZ5uhMEgkifR-IL4iF-_5GxMUM2qJspLuoJVIllMiuQGB7iKcHq5yGa-CnSgQFjGW9k2MbSjqhDLhChYAQOdJPLQ";

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext( {
      headers: {
        'authorization': idToken,
        'account-id': "5ad4a742b8f1fb0917b60fe2"
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
