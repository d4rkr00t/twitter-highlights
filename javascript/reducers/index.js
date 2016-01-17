// https://api.twitter.com/1.1/statuses/home_timeline.json&oauth_consumer_key=rGw8BscOhh1tjzufxtZHg&oauth_nonce=42ca84471b900eea8101b7f4fabd4b35&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1452761960&oauth_token=89900687-wfN2PdnOADwPG0jZju309nGOGEQwYpuTndAtcrk9t&oauth_version=1.0

/**
 * Initial State
 * @type {State}
 */
const initialState = {
  twitter: {}
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
