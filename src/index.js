import React from 'react';
import thunkMiddleware from 'redux-thunk'
import { Router, Route, Link, browserHistory } from 'react-router'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import appState from './reducers';
import App from 'components/App.jsx';

const store = createStore(
  appState,
  applyMiddleware(
    thunkMiddleware
  )
)

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'))
