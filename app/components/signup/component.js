import $ from 'jquery';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LaddaButton from 'react-ladda';
import Mask from 'react-maskedinput';

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

  componentDidMount() {
    new google.maps.places.Autocomplete(document.getElementById('address'), {});
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.authenticated()) {
      this.context.router.replace(routePaths.index);
      $('body').removeClass('gray-bg');
    }
  },

  getInitialState() {
    return {
      loading: false,
      errors: {},
      fields: {
        email: {validators: [this.validators.required({errorMsg: 'Email is required'}), this.validators.email({validateEvent: 'submit'})]},
        password: this.validators.required({errorMsg: 'Password is required'}),
        password1: this.validators.equalField({field: 'password', errorMsg: 'Passwords must match'}),
        venueName: this.validators.required({errorMsg: 'Venue name is required'}),
        venueDescription: this.validators.required({errorMsg: 'Description is required'}),
        file: this.validators.required({errorMsg: 'File is required'}),
        phoneNumber: this.validators.required({errorMsg: 'Phone is required'}),
        firstName: this.validators.required({errorMsg: 'First name is required'}),
        lastName: this.validators.required({errorMsg: 'Last name is required'}),
        address: this.validators.required({errorMsg: 'Address is required'}),
        websiteAddress: this.validators.url({validateEvent: 'submit'})
      }
    };
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
      let file;

      res.data.username = res.data.email;

      file = this.refs.file.files[0];
      file = new Parse.File(file.name, file);

      res.data.file = file;

      this.setState({loading: true});
      if (!res.data.websiteAddress.length) {
        res.data.websiteAddress = 'www.sharefishapp.com';
      }
      this.props.signUp(res.data)
    }
  },

  render() {
    let errors = this.state.errors;
    let { user } = this.props;

    return (
      <div className="middle-box text-center loginscreen" onSubmit={this.handleSubmit}>
        <div>
          <img style={{maxWidth: "100%"}} src="./sharefish.png" />
          <form className="m-t" role="form">
            <div className={errors.email ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.email}</label>
              <input className="form-control" name="email"
                onChange={this.handleChange}
                placeholder="Email"
                ref="email"
                type="text" />
            </div>

            <div className={errors.password ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.password}</label>
              <input className="form-control" name="password"
                onChange={this.handleChange}
                placeholder="Password"
                ref="password"
                type="password" />
            </div>

            <div className={errors.password1 ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.password1}</label>
              <input className="form-control" name="password1"
                onChange={this.handleChange}
                placeholder="Confirm password"
                ref="password1"
                type="password" />
            </div>

            <div className={errors.firstName ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.firstName}</label>
              <input className="form-control" name="firstName"
                onChange={this.handleChange}
                placeholder="First Name"
                ref="firstName"
                type="text" />
            </div>

            <div className={errors.lastName ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.lastName}</label>
              <input className="form-control" name="lastName"
                onChange={this.handleChange}
                placeholder="Last Name"
                ref="lastName"
                type="text" />
            </div>

            <div className={errors.venueName ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.venueName}</label>
              <input className="form-control" name="venueName"
                onChange={this.handleChange}
                placeholder="Venue name"
                ref="venueName"
                type="text" />
            </div>
            <span style={{color: "#02C5F6", fontSize: "0.8em"}}>
              used {(this.refs.venueDescription && this.refs.venueDescription.value.length) || 0} of 120 chars
            </span>
            <div id="description" className={errors.venueDescription ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.venueDescription}</label>
              <input maxLength="120" className="form-control" name="venueDescription"
                onChange={this.handleChange}
                placeholder="Venue description"
                ref="venueDescription"
                type="text" />
            </div>

            <div className={errors.phoneNumber ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.phoneNumber}</label>
              <Mask className='form-control' mask='###-###-####'
                onChange={this.handleChange}
                pattern='^\d{3}-\d{3}-\d{4}$'
                name="phoneNumber"
                placeholder='Phone number'
                ref='phoneNumber' type='tel'/>
            </div>

            <div className={errors.file ? 'form-group has-error' : 'form-group'}>
              <label className={errors.file ? 'error' : ''}>{errors.file || "Choose one image to represent your venue:"}</label>
              <input className="form-control" name="file"
                onChange={this.handleChange}
                ref="file"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                type="file" />
            </div>

            <div className={errors.address ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.address}</label>
              <input className="form-control" id="address" name="address"
                onChange={this.handleChange}
                placeholder="Address"
                ref="address"
                type="text" />
            </div>

            <div className={errors.websiteAddress ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.websiteAddress}</label>
              <input className="form-control" id="websiteAddress" name="websiteAddress"
                onChange={this.handleChange}
                placeholder="Website address"
                ref="websiteAddress"
                type="text" />
            </div>


            <LaddaButton buttonStyle="expand-right" className="btn btn-primary block full-width m-b"
              loading={this.state.loading}
              type="submit">
              Sign up
            </LaddaButton>
            <p className="text-muted text-center"><small>Already have an account?</small></p>
            <Link className="btn btn-sm btn-white btn-block" to={routePaths.login.path} >Sign in</Link>
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
