import React from 'react';

const Highlights = React.createClass({
  displayName: 'Highlights',

  render() {
    return (
      <div className="row">
        <div className="col s12 m4">
          <div className="card">
            <div className="card-content">
              <p>I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.</p>
            </div>
            <div className="card-action">
              <a href="#" className="pink-text">This is a link</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Highlights;
