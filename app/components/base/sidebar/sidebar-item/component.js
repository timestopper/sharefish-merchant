import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';


export default React.createClass({
  handleClick(event) {
    if (!this.props.sidebarItem.href) {
      event.preventDefault();
    }

    if (this.props.sidebarItem.childrens) {
      Actions.switchOpen(this.props.sidebarItem);
    } else {
      Actions.setActive(this.props.sidebarItem.id);
    }
  },

  getMenuPaths() {
    let sidebarItem = this.props.sidebarItem;
    let paths = [sidebarItem.href];
    if (sidebarItem.childrens) {
      sidebarItem.childrens.map((p) => {
        paths.push(p.href);
      });
    }
    return paths;
  },

  checkPath(path) {
    let paths = this.getMenuPaths();
    let isActive = false;
    paths.map((p) => {if (path.startsWith(p)) {
      isActive = true;
    }});
    return isActive;
  },

  render() {
    let sidebarItem = this.props.sidebarItem;
    let sidebarItems = [];

    let ulClasses = cx({
      'nav nav-second-level': true,
      'menu-expanded': ((this.props.path && (this.checkPath(this.props.path)) ) || sidebarItem.isOpen)
    });


    let liClasses = cx({
      'active': ((this.props.path && (this.checkPath(this.props.path)) ) || sidebarItem.isActive),
      'is-open': sidebarItem.isOpen,
    });

    let spanClasses = cx({
      'nav-label': true
    });

    return (
      <li className={liClasses}>
        {sidebarItem.href && (
        <Link to={sidebarItem.href} onClick={this.handleClick} >
          {sidebarItem.icon && <i className={sidebarItem.icon}></i>}
          <span className={spanClasses}>{sidebarItem.name}</span>
        </Link>
        )}
        {!sidebarItem.href && (
        <a onClick={this.handleClick} >
          {sidebarItem.icon && <i className={sidebarItem.icon}></i>}
          <span className={spanClasses}>{sidebarItem.name}</span>
          {sidebarItem.childrens && <span className='fa arrow'></span>}
        </a>
        )}
        <ul ref='ul' className={ulClasses}>
          { sidebarItem.childrens && sidebarItem.isOpen &&
            sidebarItem.childrens.map( (item, key) => {
              return (
                <sidebarItem
                  key={key}
                  sidebarItem={item}
                />
              );
            })
          }
        </ul>
      </li>
    );
  }
});
