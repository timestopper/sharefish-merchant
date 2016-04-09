import $ from 'jquery';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LaddaButton from 'react-ladda';

import ValidateMixin from '../../../lib/validate-mixin/mixin'
import * as SpecialsActions from '../../../actions/specials';


const ItemFormComponent = React.createClass({
  mixins: [ValidateMixin],

  getInitialState() {
    return {
      errors: {},
      disabled: true,
      fields: {
        Title: this.validators.required,
        Price: {validators: this.validators.required, converter: this.converters.setFloat},
        EmojiVar: {validators: this.validators.required, converter: this.converters.int}
      }
    };
  },

  handleChange(event) {
    let res = this.validate();
    if (Object.keys(res.errors).length === 0) {
      this.setState({disabled: false});
    } else {
      this.setState({disabled: true});
    }
  },

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.disabled) {
      let res = this.validate();

      this.refs.Title.value = "";
      this.refs.Price.value = "";
      this.refs.EmojiVar.value = "";

      if (this.props.special) {
        this.props.special.set(res.data);
        this.props.updateSpecial(this.props.special);
        this.props.endEdit();
      } else {
        this.props.saveSpecial(res.data, this.props.Dates);
      }
    }
  },

  render() {
    let errors = this.state.errors;
    let special = this.props.special;

    if (this.props.special) {
      return (
        <tr>
          <td>
            <div className="input-group">
              <input defaultValue={special.get('Title')} ref="Title" name="Title" onChange={this.handleChange} type="text" placeholder="New special" className="input-sm form-control" />
            </div>
          </td>
          <td>
            <div className="input-group">
              <input defaultValue={special.get('Price')} ref="Price" name="Price" onChange={this.handleChange} type="number" placeholder="Price" className="input-sm form-control" />
            </div>
          </td>

          <td>
            <select defaultValue={special.get('EmojiVar')} ref="EmojiVar" name="EmojiVar" onChange={this.handleChange} className="input-sm form-control input-s-sm inline">
              <option value="0">Beer</option>
              <option value="1">Wine</option>
              <option value="2">Cocktail/Liquor</option>
            </select>
          </td>

          <td>
            <LaddaButton disabled={this.state.disabled} buttonStyle="expand-right" className="btn btn-primary block full-width m-b"
              onClick={this.handleSubmit}
              loading={false}
              type="submit">
              Save
            </LaddaButton>
          </td>
          <td></td>
        </tr>

      );
    } else {
      return (
        <div className="row" onSubmit={this.handleSubmit}>
          <div className="col-sm-2">
            <div className="input-group">
              <input ref="Title" name="Title" onChange={this.handleChange} type="text" placeholder="New special" className="input-sm form-control" />
            </div>
          </div>

          <div className="col-sm-2">
            <div className="input-group">
              <input ref="Price" name="Price" onChange={this.handleChange} type="number" placeholder="Price" className="input-sm form-control" />
            </div>
          </div>

          <div className="col-sm-2">
            <select ref="EmojiVar" name="EmojiVar" onChange={this.handleChange} className="input-sm form-control input-s-sm inline">
              <option value="0">Beer</option>
              <option value="1">Wine</option>
              <option value="2">Cocktail/Liquor</option>
            </select>
          </div>

          <div className="col-sm-2">
            <LaddaButton disabled={this.state.disabled} buttonStyle="expand-right" className="btn btn-primary block full-width m-b"
              onClick={this.handleSubmit}
              loading={this.props.inSave}
              type="submit">
              Add
            </LaddaButton>
          </div>
        </div>
      );
    }
  }
});


function mapStateToProps(state) {
  return {
    inSave: state.specials.inSave,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(SpecialsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemFormComponent);
