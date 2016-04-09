import $ from 'jquery';
import cx from 'classnames';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link } from 'react-router';
import LaddaButton from 'react-ladda';

import ValidateMixin from '../../lib/validate-mixin/mixin'
import routePaths from '../../routes';
import * as UserActions from '../../actions/user';


const PageComponent = React.createClass({
  mixins: [ValidateMixin],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentWillMount() {
    $('body').addClass('gray-bg');
  },

  getInitialState() {
    return {
      loading: false,
      errors: {},
      fields: {
        email: {validators: [this.validators.required, this.validators.email({validateEvent: 'submit'})]},
        password: this.validators.required
      }
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.authenticated()) {
      this.context.router.replace(routePaths.index);
      $('body').removeClass('gray-bg');
    } else {
      this.setState({loading: false});
      let errors = this.state.errors;
      errors.email = 'email or password is incorrect';
      this.setState({errors});
    }
  },

  handleChange(event) {
    let validateObj = {};
    let fieldName = event.target.name;

    validateObj[fieldName] = this.state.fields[fieldName];
    let res = this.validate('change', validateObj);
    this.setState({errors: res.errors});
  },

  handleSubmit(event) {
    event.preventDefault();
    let res = this.validate();

    if (Object.keys(res.errors).length !== 0) {
      this.setState({errors: res.errors});
    } else {
      this.setState({loading: true});
      this.props.signIn(res.data.email, res.data.password)
    }
  },

  requestPasswordReset: function requestPasswordReset() {
    let email = this.refs.email.value;

    if (email) {
      this.setState({loading: true});
      Parse.User.requestPasswordReset(email, {
        success: () => {
          this.setState({loading: false});
          alert("Email is sent!")
        },
        error: (error) => {
          this.setState({loading: false});
          alert("Error: " + error.code + " " + error.message);
        }
      });
    } else {
      this.setState({needEmail: true});
    }
  },

  render() {
    let needEmail;

    if (this.state.needEmail) {
      needEmail = <div>
        In order to send reset password request we need to know your email.
      </div>
    }

    let errors = this.state.errors;

    let emailClasses = cx({
      'form-group': true,
      'has-error': errors.email
    });

    let passwordClasses = cx({
      'form-group': true,
      'has-error': errors.password
    });

    return (
      <div className="middle-box text-center loginscreen" onSubmit={this.handleSubmit}>
        <div>
          <img style={{maxWidth: "100%"}} src="./sharefish.png" />
          <form className="m-t" role="form">
            <div className={emailClasses}>
              <label className="error">{errors.email}</label>
              <input className="form-control" name="email"
                onChange={this.handleChange}
                placeholder="Email"
                ref="email"
                type="text" />
            </div>
            <div className={passwordClasses}>
              <label className="error">{errors.password}</label>
              <input className="form-control" name="password"
                onChange={this.handleChange}
                placeholder="Password"
                ref="password"
                type="password" />
            </div>
            <LaddaButton buttonStyle="expand-right" className="btn btn-primary block full-width m-b"
              loading={this.state.loading}
              type="submit">
              Log in
            </LaddaButton>
            <a onClick={this.requestPasswordReset}>
              <small>Forgot your password?</small>
            </a>
            <small>
              {needEmail}
            </small>
            <Link to={routePaths.signup.path} className="btn btn-sm btn-white btn-block">Sign up</Link>
          </form>
        </div>
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    user: state.user
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageComponent);
