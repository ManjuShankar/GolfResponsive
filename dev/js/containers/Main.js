import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Login from '../components/login';
import Header from '../components/header';
import Sidebar from '../components/sidebar';

class Main extends Component{
    constructor(props, context){
        super(props, context);
    }

   render(){
          let userLocalStorage = JSON.parse(localStorage.getItem('userDetails'));
          return(<div>{((location.pathname!="/" && location.pathname!='/register' && location.pathname!="/enterEmail" && location.pathname!='/enterOTP' && location.pathname!='/enterNewPassword') && (this.props.activeUser!=null || userLocalStorage!=null))?(<div><Sidebar/><Header /></div>):(<div></div>)}
          <div>{this.props.children}</div></div>);
   }
}

Main.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
  console.log("activeUser",state.activeUser);
    return {
      activeUser: state.activeUser
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Main);
