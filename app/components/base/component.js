import React from 'react';

import SidebarComponent from './sidebar/component';
import ContentComponent from './content/component';
import SpinnerComponent from './spinner/component';


export default React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  render() {
    let currentUser = Parse.User.current();

    return (
      <div id='wrapper' style={{minHeight: "100% !important", height: "100%"}}>
          <a href="http://www.sharefishapp.com/" style={{position: "absolute", left: "3px", bottom: "3px", color: "#FFA407"}}>
            ShareFish App
          </a>

        {currentUser &&
        <SidebarComponent/>
        }
        <ContentComponent
          mainPage={this.props.children}/>
      </div>
    );
  }
});
