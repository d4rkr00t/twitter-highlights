import { createStore, compose } from 'redux';

import reducers from './../reducers';

import DevTools from './../components/DevTools.jsx';

const finalCreateStore = compose(
  DevTools.instrument()
)(createStore);


export default function configureStore(initialState) {
  const store = finalCreateStore(reducers, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
