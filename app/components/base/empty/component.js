import React from 'react';

export default React.createClass({
  render() {
    if (this.props.isShow) {
      let component = this.props.children;
      if (!component) {
        component = (
          <div className="text-center">
            {this.props.msg}
          </div>
        );
      }
      return (
        component
      );
    } else { return null; }
  }
});
