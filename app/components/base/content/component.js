import React from 'react';


export default React.createClass({
  propTypes: {
    mainPage: React.PropTypes.element.isRequired
  },

  render() {
    let currentUser = Parse.User.current();

    if (currentUser) {
      return (
        <div className='gray-bg dashbard-1' id='page-wrapper' style={{minHeight: "100% !important", height: "100%"}}>
          {this.props.mainPage}
        </div>
      );
    } else {
      return (
        <div>
          {this.props.mainPage}
        </div>
      );
    }
  }
});
