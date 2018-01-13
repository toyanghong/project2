import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'antd';

 
 
class City2 extends React.PureComponent {
    
    

    render() {

        console.log(this.props.match.params.name);
        return (
            <div class="city">
            {this.props.match.params.name}
            <br/>
              这是t2页面
            </div>
        );
    }
}

export default City2
