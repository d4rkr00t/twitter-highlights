import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root.jsx';

const ID = 'app';

let $container = document.querySelector('#' + ID);

ReactDOM.render(<Root/>, $container);
