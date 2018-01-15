import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'antd';


import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import  RouterMap  from './test2.js';


// import { funt, a, d } from 'bundle-loader!./test2.js';
// import { Other } from 'bundle-loader?lazy&name=admin!./c.js';

import Loadable from 'react-loadable';
// import Loading from './loading.js';
// import { Bundle } from './print.js';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();


class App extends React.PureComponent {
    
  

  render() {
      return (
          <div class="city">

          {this.props.children}
              
          </div>
      );
  }
}


ReactDOM.render(
  <App>
    <RouterMap />
  </App>
  ,
  document.getElementById('root')
);