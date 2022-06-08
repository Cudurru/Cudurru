import React, { Component } from "react";
import { Link, useHistory, Redirect } from 'react-router-dom';

class LogoutPage extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        /*Set the JWT to null*/
        localStorage.setItem("jwt", "");

        /*Make sure App component updates it's isLoggedIn state */
        this.props.checkIfLoggedIn();
    }

    render(){
        /*Redirect to Login Page*/        
        if(this.props.isLoggedIn === false)
            return <Redirect to='/login'></Redirect>
        else
            return ""
    }
}

export default LogoutPage;