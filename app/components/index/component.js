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
]


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

  render() {
    let { specials, inLoad } = this.props;

    return (
      <div className="row">
        <div className="ibox-content">
          <div className="row">
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
                            <th>Price </th>
                            <th>Category</th>
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
                                  <td style={{width: '20px'}}>
                                    <a onClick={this.setEdit.bind(this, special)} className="btn btn-sm btn-white btn-block">Edit</a>
                                  </td>
                                  <td style={{width: '20px'}}>
                                    <a onClick={this.props.deleteSpecial.bind(this, special)} className="btn btn-sm btn-white btn-block">Delete</a>
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
        </div>
      </div>
    );
  }
});


function mapStateToProps(state) {
  return {
    specials: state.specials.items,
    inLoad: state.specials.inLoad,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(SpecialsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageComponent);
