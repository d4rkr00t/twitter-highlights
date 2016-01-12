require('../../common/css/material.css');

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducers from './../reducers';

import App from './../components/App.jsx';

const store = createStore(reducers);

export default React.createClass({
  displayName: 'Root',

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
});
