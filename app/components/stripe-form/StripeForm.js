import React from 'react';

import ReactCardFormContainer from 'card-react';

module.exports = React.createClass({
  displayName: "StripeForm",
  render() {
    return (
    <div>
      <ReactCardFormContainer

        // the id of the container element where you want to render the card element.
        // the card component can be rendered anywhere (doesn't have to be in ReactCardFormContainer).
        container="card-wrapper" // required

        // an object contain the form inputs names.
        // every input must have a unique name prop.
        formInputsNames={
          {
            number: 'CCnumber', // optional — default "number"
            expiry: 'CCexpiry',// optional — default "expiry"
            cvc: 'CCcvc', // optional — default "cvc"
            name: 'CCname' // optional - default "name"
          }
        }

        // initial values to render in the card element
        initialValues= {
          {
            number: '', // optional — default •••• •••• •••• ••••
            cvc: '', // optional — default •••
            expiry: '', // optional — default ••/••
            name: '' // optional — default FULL NAME
          }
        }

        // the class name attribute to add to the input field and the corresponding part of the card element,
        // when the input is valid/invalid.
        classes={
          {
            valid: 'valid-input', // optional — default 'jp-card-valid'
            invalid: 'invalid-input' // optional — default 'jp-card-invalid'
          }
        }

        // specify whether you want to format the form inputs or not
        formatting={true} // optional - default true
        >

        <div>
          <div className="form-group">
            <label>Billing information</label>
            <input placeholder="Full name" type="text" name="CCname" ref="CCname" className="form-control"/>
          </div>
          <div className="form-group">
           <input placeholder="Card number" type="text" name="CCnumber" ref="CCnumber" className="form-control"/>
          </div>
          <div className="form-group">
            <input placeholder="MM/YY" type="text" name="CCexpiry" ref="CCexpiry" className="form-control"/>
          </div>
          <div className="form-group">
            <input placeholder="CVC" type="text" name="CCcvc" ref="CCcvc" className="form-control"/>
          </div>
        </div>

      </ReactCardFormContainer>

      <div className="form-group">
        <div id="card-wrapper" style={{marginLeft:'-6px'}}></div>
      </div>
    </div>
    );
  }
});


