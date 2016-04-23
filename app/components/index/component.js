import $ from 'jquery';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LaddaButton from 'react-ladda';
import Mask from 'react-maskedinput';

import ValidateMixin from '../../lib/validate-mixin/mixin'
import routePaths from '../../routes';
import SpinnerComponent from '../base/spinner/component';
import ItemFormComponent from './item-form/component';

import * as SpecialsActions from '../../actions/specials';

const Days = [
  {name: 'Sunday', value: 'Sun'},
  {name: 'Monday', value: 'Mon'},
  {name: 'Tuesday', value: 'Tue'},
  {name: 'Wednesday', value: 'Wed'},
  {name: 'Thursday', value: 'Thu'},
  {name: 'Friday', value: 'Fri'},
  {name: 'Saturday', value: 'Sat'}
];

const PageComponent = React.createClass({
  mixins: [ValidateMixin],

  getInitialState() {
    return {
      currentDay: 'Mon'
    };
  },

  componentWillMount() {
    $('body').removeClass('gray-bg');
    this.props.getSpecials(this.state.currentDay);
  },

  changeDay(day) {
    if (!this.state.inLoad) {
      this.setState({currentDay: day.value});
      this.props.getSpecials(day.value);
    }
  },

  setEdit(special) {
    this.setState({onEdit: special});
  },

  endEdit() {
    this.setState({onEdit: false});
  },

  handleChange(event) {

  },

  handleSaveHours() {

    let hrNotes;
    if (this.refs.Hours) {
      hrNotes = [];
      hrNotes.push( this.refs.Hours.value + '-' + this.refs.Hours2.value );
      hrNotes.push( this.refs.Notes.value );

      this.props.updateHoursAndNotes( this.props.location, hrNotes, this.state.currentDay, this.props.special );
    }
  },

  render() {
    let { specials, inLoad, location } = this.props;

    /* Start hours and notes logic */

    let dayToIndex = {
        Sun : 0
        ,Mon : 1
        ,Tue : 2
        ,Wed : 3
        ,Thu : 4
        ,Fri : 5
        ,Sat : 6
    };

    let hoursAndNotes;
    if ( location && location.attributes['Daily'] ) {
      hoursAndNotes = location.attributes.Daily[ dayToIndex[this.state.currentDay] ];
    } else {
      hoursAndNotes = ['10am-5pm', ' '];
    }

    let hoursAr;
    if (hoursAndNotes && this.refs.Hours) {
      hoursAr = hoursAndNotes[0].split('-');
      this.refs.Hours.value = hoursAr[0];
      this.refs.Hours2.value = hoursAr[1];
      this.refs.Notes.value = hoursAndNotes[1];
    }

    /* End hours and notes logic */


    return (
      <div className="row">
        <div className="ibox-content">
          <div className="row specials-top-part">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <div data-toggle="buttons" className="btn-group">
                  {
                    Days.map( (day, key) => {
                      let className = 'btn btn-sm btn-white'
                      if (day.value === this.state.currentDay) {
                        className += ' active';
                      }
                      return (
                        <label key={key} disabled={inLoad} className={className}> <input onClick={this.changeDay.bind(this, day)} type="radio"/> {day.name} </label>
                      );
                    })
                  }
                  </div>
                </div>
                <div className="col-lg-12" style={{marginTop: '10px'}}>
                  <ItemFormComponent Dates={this.state.currentDay} />

                  <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Special</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Everyday Special?</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          specials.map( (special, key) => {
                            if (this.state.onEdit && this.state.onEdit.id === special.id) {
                              return (
                                <ItemFormComponent key={special.id} Dates={this.state.currentDay} special={special} endEdit={this.endEdit} />
                              );
                            } else {
                              return (
                                <tr key={special.id}>
                                  <td>{special.get('Title')}</td>
                                  <td>{special.get('CurType')}</td>
                                  <td>{special.get('Price')}</td>
                                  <td>
                                  {
                                    (() => {
                                      switch(special.get('EmojiVar')) {
                                      case 0:
                                        return 'Beer';
                                      case 1:
                                        return 'Wine';
                                      case 2:
                                        return 'Cocktail/Liquor';
                                      };
                                    })()
                                  }
                                  </td>
                                  <td><input checked={special.get('Everyday')} readOnly={true} type="checkbox" /></td>
                                  <td style={{width: '20px'}}>
                                    <a onClick={this.setEdit.bind(this, special)} className="btn btn-sm btn-white btn-block">Edit</a>
                                  </td>
                                  <td style={{width: '100px'}}>
                                    <a onClick={this.props.deleteSpecial.bind(this, special, this.props.location)} className="btn btn-sm btn-white btn-block">Delete</a>
                                  </td>
                                </tr>
                              );
                            }
                          })
                        }
                        </tbody>
                    </table>
                    <SpinnerComponent isShow={inLoad}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row specials-footer">

            <div className="row input-group">
              <div className="col-sm-2">
                <label>Hours</label>
              </div>
              <div className="col-sm-3 hrs-wrap1">
                <input onChange={this.handleChange} ref="Hours" name="Hours" type="text" className="input-sm form-control" />
              </div>
              <div className="col-sm-1">
                <label>-</label>
              </div>
              <div className="col-sm-3">
                <input ref="Hours2" name="Hours2" type="text" className="input-sm form-control" />
              </div>
            </div>
            <div className="row input-group">
              <label> </label>
            </div>
            <div className="row input-group">
              <div className="col-sm-4">
                <label>Notes</label>
              </div>
              <div className="col-sm-8">
                <input ref="Notes" name="Notes" type="text" className="input-sm form-control" />
              </div>
            </div>
            <div className="row input-group">
              <label> </label>
            </div>
            <div className="row input-group">
              <div className="col-sm-12 col-sm-offset-6" >
                <LaddaButton buttonStyle="expand-right" className="btn btn-primary block full-width m-b"
                  onClick={this.handleSaveHours}
                  type="submit">
                  Save Hours &amp; Notes
                </LaddaButton>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }
});


function mapStateToProps(state) {
    return {
      specials: state.specials.items,
      inLoad: state.specials.inLoad,
      location: state.specials.location
    };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(SpecialsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageComponent);
