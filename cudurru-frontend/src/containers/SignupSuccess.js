import React, {Component} from "react";
import {Link} from "react-router-dom";

import '../components/Button.scss'
import './SignupSuccess.scss'

class SignupSuccess extends Component {
    render() {
    	return (
    	<div className="signup-success main-content">
        	<div className="signup-wrapper">
        		<h2>Your account was successfully created!</h2>
        		{/* <p>Please check your email for further instructions</p> */}
				<p>You can now sign in using your email and password</p>
        		<Link className="button-primary" to="/login">Sign In</Link>
        	</div>
		</div>
    	);
	}
}

export default SignupSuccess;