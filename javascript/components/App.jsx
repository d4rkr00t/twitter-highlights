import React from 'react';

import DevTools from './../components/DevTools.jsx';
import Header from './Header.jsx';
import Highlights from './Highlights.jsx';

const App = React.createClass({
  displayName: 'App',

  render() {
    return (
      <div>
        <Header/>

        <div className="container" style={{ marginTop: 24 }}>
          <Highlights/>
        </div>
        <DevTools />
      </div>
    );
  }
});

export default App;
