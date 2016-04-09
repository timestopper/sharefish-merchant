import React from 'react';
import SidebarItem from './sidebar-item/component';
import routePaths from '../../../routes';
import ProfileItem from '../profile/component';


const menuItems = [
  {
    id: 'SpecialsPage',
    name: 'Specials',
    icon: 'fa fa-list-ul',
    href: routePaths.index.path
  },
  {
    id: 'LogoutUrl',
    icon: 'fa fa-sign-out',
    name: 'Logout',
    href: routePaths.logout.path
  }
];


export default React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <nav className='navbar-default navbar-static-side'>
        <div className='sidebar-collapse'>
          <ul className='nav metismenu'>
            <ProfileItem />
            {
              menuItems.map( (item, key) => {
                return (
                  <SidebarItem
                    hideOnClose={false}
                    key={key}
                    path={'/'}
                    sidebarItem={item} />
                );
              })
            }
          </ul>
        </div>
      </nav>
    );
  }
});
