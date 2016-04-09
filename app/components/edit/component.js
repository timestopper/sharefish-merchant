import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import $ from 'jquery';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LaddaButton from 'react-ladda';
import Mask from 'react-maskedinput';

import ValidateMixin from '../../lib/validate-mixin/mixin'
import routePaths from '../../routes';

import * as UserActions from '../../actions/user';
import * as SpecialsActions from '../../actions/specials';


var EditComponent = React.createClass({
  mixins: [ValidateMixin],

  contextTypes: {
    store: React.PropTypes.object
  },

  createInput() {
    document.getElementById('editProfileAddress') && (new google.maps.places.Autocomplete(document.getElementById('editProfileAddress'), {}));
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.location && (this.state.loading == true)) {
      this.setState({loading: false});
      this.setState({success: true});
    };
    if (!nextProps.user.location && (this.state.loading == true)) {
      this.setState({success: false});
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
        address: this.validators.required({errorMsg: 'Address is required'})
      }
    };
  },

  handleChange(event) {
    var validateObj = {};
    var fieldName = event.target.name;

    validateObj[fieldName] = this.state.fields[fieldName];
    var res = this.validate('change', validateObj);
    this.setState({errors: res.errors});
  },

  handleSubmit(event) {
    event.preventDefault();
    var res = this.validate();

    if (Object.keys(res.errors).length !== 0) {
      this.setState({errors: res.errors});
    } else {
      res.data.username = res.data.email;

      let file;

      res.data.username = res.data.email;

      file = this.refs.file.files[0];
      file = new Parse.File(file.name, file);

      res.data.file = file;

      this.setState({loading: true});
      this.props.actionTwo.editProfile(Parse.User.current(), this.props.location, res.data)
    }
  },

  render: function render() {
    var errors = this.state.errors;
    var { user, location} = this.props;
    var successMessage;

    if (this.state.success != undefined) {
      if (this.state.success) {
        successMessage = "Saved edited profile."
      } else {
        successMessage = "Couldnt save edited profile."
      }
    };

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} onShow={this.createInput}>
        <Modal.Header>
            <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body onSubmit={this.handleSubmit}>
          <img style={{maxWidth: "100%"}} src="./sharefish.png" />

          <form className="m-t" role="form">
            <div className={errors.email ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.email}</label>
              <input className="form-control" name="email"
                onChange={this.handleChange}
                placeholder="Email"
                defaultValue={Parse.User.current().get("email")}
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
                placeholder="Repeat password"
                ref="password1"
                type="password" />
            </div>

            <div className={errors.firstName ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.firstName}</label>
              <input className="form-control" name="firstName"
                onChange={this.handleChange}
                defaultValue={Parse.User.current().get("firstName")}
                placeholder="First Name"
                ref="firstName"
                type="text" />
            </div>

            <div className={errors.lastName ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.lastName}</label>
              <input className="form-control" name="lastName"
                onChange={this.handleChange}
                defaultValue={Parse.User.current().get("lastName")}
                placeholder="Last Name"
                ref="lastName"
                type="text" />
            </div>

            <div className={errors.venueName ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.venueName}</label>
              <input defaultValue={location && location.get && location.get("Name")}
                className="form-control" name="venueName"
                onChange={this.handleChange}
                placeholder="Venue name"
                ref="venueName"
                type="text" />
            </div>
            <span style={{color: "#02C5F6", fontSize: "0.8em"}}>
              used {(this.refs.venueDescription && (this.refs.venueDescription.value.length || "0")) || (location && location.get && location.get("Description").length)} of 120 chars
            </span>
            <div className={errors.venueDescription ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.venueDescription}</label>
              <input maxLength="120" defaultValue={location && location.get && location.get("Description")} className="form-control" name="venueDescription"
                onChange={this.handleChange}
                placeholder="Venue description"
                ref="venueDescription"
                type="text" />
            </div>

            <div className={errors.phoneNumber ? 'form-group has-error' : 'form-group'}>
              <label className="error">{errors.phoneNumber}</label>
              <Mask className='form-control' mask='###-###-####'
                onChange={this.handleChange}
                value={location && location.get && location.get("Phone")}
                pattern='^\d{3}-\d{3}-\d{4}$'
                name="phoneNumber"
                placeholder='Phone number'
                ref='phoneNumber' type='tel'/>
            </div>

            <img style={{maxWidth: "100%"}} src={location && location.get && location.get("Image")._url} />
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
              <input className="form-control" id="editProfileAddress" name="address"
                defaultValue={location && location.get && location.get("Address")}
                onChange={this.handleChange}
                placeholder="Address"
                ref="address"
                type="text" />
            </div>

            <LaddaButton buttonStyle="expand-right" className="btn btn-primary block full-width m-b"
              loading={this.state.loading}
              type="submit">
                Save
            </LaddaButton>
          </form>
          <span>
            {successMessage}
          </span>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
    location: (state.user && state.user.location) || state.specials.location,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actionOne: bindActionCreators(SpecialsActions, dispatch),
    actionTwo: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditComponent);
