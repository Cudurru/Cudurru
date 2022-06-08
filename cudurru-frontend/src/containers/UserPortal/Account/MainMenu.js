import React, {Component} from "react";
import { Link } from "react-router-dom";

export default function MainMenu() {

    return (
    	<div className="main-menu panel">
            <h2>Account</h2>
			<h3>Hi! {this.props.name}</h3>
    		<Link to="" className="btn">Account Info</Link><br />
			<Link to="" className="btn">Account Preferences</Link><br />
    		<Link to="" className="btn">Provide Feedback</Link><br />
			<Link className="logout" to="">Logout</Link>
    	</div>
    );
}