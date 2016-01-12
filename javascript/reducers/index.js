/**
 * Initial State
 * @type {State}
 */
const initialState = {

};

/**
 * List of reducers which will be applied to state;
 * @type {Array}
 */
const reducersList = [(state) => state];

/**
 * Main reducer function. Apply list of reducers to state;
 *
 * @param {State} state
 * @param {Action} action
 *
 * @returns {State}
 */
export default function reducer(state, action) {
  state = state || initialState;

  return reducersList.reduce((newState, r) => r(newState, action), state);
}

/**
 * State of entire application
 *
 * @typedef {Object} State
 */

/**
 * Action
 *
 * @typedef {Object} Action
 *
 * @property {String} type - Action type.
 * ...
 */
