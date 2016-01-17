require('./../../common/css/materialize.css');

import React from 'react';
import configureStore from './../store/configure';
import { Provider } from 'react-redux';

import App from './../components/App.jsx';

const store = configureStore();

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
