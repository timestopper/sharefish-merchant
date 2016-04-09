import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditModal from "../../edit/component";
import * as UserActions from '../../../actions/user';
import * as SpecialsActions from '../../../actions/specials';


const ProfileItem = React.createClass({
  getInitialState() {
    return {
      resetPasswordModalShow: false,
    };
  },

  toggleResetPasswordModalShow() {
    this.setState({ resetPasswordModalShow: !this.state.resetPasswordModalShow });
  },

  render() {

    return (
      <li className="nav-header">
        <div className="profile-element">
          <span className="text-muted text-xs block">
            Hello, {this.props.location && this.props.location.get && this.props.location.get("Name")}
          </span>
          <a onClick={this.toggleResetPasswordModalShow}>
            Edit Profile
          </a>
          <EditModal
            onConfirm={this.toggleResetPasswordModalShow}
            onHide={this.toggleResetPasswordModalShow}
            show={this.state.resetPasswordModalShow} />
        </div>
      </li>
    );
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
    location: (state.user && state.user.location) || state.specials.location,
    specials: state.specials,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(UserActions, SpecialsActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileItem);
