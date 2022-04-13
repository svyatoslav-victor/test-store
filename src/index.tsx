import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        fields: {
          attributes: {
            read(attributes) {
              return attributes.items;
            }
          }
        }
      }
    }
  })
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
