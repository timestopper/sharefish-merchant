import $ from 'jquery';

import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LaddaButton from 'react-ladda';
import Mask from 'react-maskedinput';

import ValidateMixin from '../../lib/validate-mixin/mixin'
import routePaths from '../../routes';

import * as UserActions from '../../actions/user';

// var StripeForm = require('../stripe-form/StripeForm.js');

const PageComponent = React.createClass({
  mixins: [ValidateMixin],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentWillMount() {
    $('body').addClass('gray-bg');
  },

  componentDidMount() {
    let autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'), {});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          autocomplete.setBounds(circle.getBounds());
        });
    }

    //  Stripe.setPublishableKey(''); // set your test public key
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.authenticated()) {
      Parse.User.logOut();
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

      // save customer id to the User object
      //res.data.stripe_customer_id = result['stripe_customer_id'];
      res.data.username = res.data.email;

      file = this.refs.file.files[0];
      file = new Parse.File(file.name, file);

      res.data.file = file;

      this.setState({loading: true});
      if (!res.data.websiteAddress.length) {
        res.data.websiteAddress = 'www.sharefishapp.com';
      }
      this.props.signUp(res.data);
    }

    /* Stripe section */
    // let stripeData = {};

    // // grab and parse stripe data from fields
    // let inpuArray = ReactDOM.findDOMNode( this.refs['cardForm'] ).querySelectorAll('input');

    // for (let input of ReactDOM.findDOMNode( this.refs['cardForm'] ).querySelectorAll('input') ) {
    //   stripeData[input['name']] = input['value'];
    // }

    // let expiryData = stripeData['CCexpiry'].split('/') 
    //     , expMonth = expiryData[0].trim()
    //     , expYear = expiryData[1].trim()
    //     , cardNumber = stripeData['CCnumber'].replace(/\s/g, '')
    //     , cardCvc = stripeData['CCcvc'].trim();

    // var self = this;

    // if (Object.keys(res.errors).length !== 0) {
    //   this.setState({errors: res.errors});
    // } else {
    //   // validate stripe data and get a stripe card id
    //   Stripe.createToken( {
    //       number: cardNumber
    //       , exp_month: expMonth
    //       , exp_year: expYear
    //       , cvc: cardCvc
    //     }
    //   , function (status, response) {

    //       if (response['error']) {
    //         console.log('stripe error: ', response['error']);
    //         alert('Stripe error: ' + response['error']['message']);
    //         return;
    //       }

    //       // !TODO: save customer stripe id after creatin a user for the security reason
    //       // request to the microservice to get customer id
    //       let processPaymentUrl = 'http://'+window.location.hostname+':3500'+'/api/registercard';

    //       $.ajax({
    //           url: processPaymentUrl,
    //           dataType: 'json',
    //           type: 'POST',
    //           //crossDomain: true,
    //           //crossOrigin: true,
    //           data: { card_id: response.id, email: res.data.email }
    //       }).done(function( result ) {

    //           if ( result['stripe_customer_id'] ) {

    //             let file;

    //             // save customer id to the User object
    //             res.data.stripe_customer_id = result['stripe_customer_id'];
    //             res.data.username = res.data.email;

    //             file = self.refs.file.files[0];
    //             file = new Parse.File(file.name, file);

    //             res.data.file = file;

    //             self.setState({loading: true});
    //             if (!res.data.websiteAddress.length) {
    //               res.data.websiteAddress = 'www.sharefishapp.com';
    //             }
    //             self.props.signUp(res.data)

    //           } else {
    //             console.log('result', result['error']);
    //             alert('Stripe error: ' + result['error']);
    //           }
    //       });

    //   });
    //}
      /* End stripe section */

  },

  render() {
    let errors = this.state.errors;
    let { user } = this.props;

    return (
      <div className="middle-box text-center loginscreen" >
        <div>
          <img style={{maxWidth: "100%"}} src="./sharefish.png" />
          <form className="m-t" role="form" id="signup-form" onSubmit={this.handleSubmit}>
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

            {/* <StripeForm ref="cardForm"/> */}

            <LaddaButton buttonStyle="expand-right" className="btn btn-primary block full-width m-b"
              loading={this.state.loading}
              type="submit"
              >
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
