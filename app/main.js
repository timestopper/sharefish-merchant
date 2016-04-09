import './styles/main.less';
import './sharefish.png';
import './index.html';
require('babel-polyfill');

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import NotFoundComponent from './components/base/notfound/component';

import AuthComponent from './components/auth/component';
import SignUpComponent from './components/signup/component';
import IndexComponent from './components/index/component';
import BaseComponent from './components/base/component';
import routePaths from './routes';
import configureStore from './store/configureStore';

const store = configureStore();

import Application from './application/application';

let app = new Application();
app.initialize();
window.App = app;


function requireAuth(nextState, replace) {
  let currentUser = Parse.User.current();
  if (!currentUser) {
    replace(routePaths.login.path);
  }
}

function logout(nextState, replace) {
  Parse.User.logOut();
  replace(routePaths.login.path);
}

const routes = {
  component: BaseComponent,
  childRoutes: [
    { path: routePaths.logout.path,
      onEnter: logout
    },
    { path: routePaths.login.path,
      component: AuthComponent
    },
    { path: routePaths.signup.path,
      component: SignUpComponent,
    },
    { path: routePaths.index.path,
      onEnter: requireAuth,
      component: IndexComponent
    },
    { path: '*',
      component: NotFoundComponent
    }
  ]
};

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('application')
);
