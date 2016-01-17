import React from 'react';

const Header = React.createClass({

  render() {
    return (
      <nav className="indigo darken-1">
        <div className="nav-wrapper container">
          <a href="#" className="brand-logo">Twitter Highlights</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="#">Username</a></li>
          </ul>
        </div>
      </nav>
    );
  }

});

export default Header;
