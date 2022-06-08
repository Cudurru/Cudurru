import React, {Component} from "react";
import { Link, useHistory } from "react-router-dom";

class GetStarted2 extends Component {
	render() {
		return (
			<div className="get-started-wrapper main-content">
				<div className="header">
					<ol className="progress-bar">
    					<li className="is-complete"><span>Confirm Address</span></li>  
    					<li className="is-complete"><span>Create Account</span></li>  
    					<li className="is-active"><span>Prep Listing</span></li>
    					<li className="is-active"><span>Publish Listing</span></li>  
    					<li className="is-active"><span>Success</span></li>
					</ol>
				</div>
				<div className="content">
					<h2>Yes, Cudurru is in your area!</h2>
					<p>Just a few more details about you and your home.</p>
					<div className="search-input row">
						<input type="text" placeholder="Address" className="rounded single-field" />
					</div>
					<div className="name-fields row">
						<input type="text" name="first-name" placeholder="First Name" className="rounded-left" />
						<input type="text" name="last-name" placeholder="Last Name" className="last-name" />
						<Link to="/get-started/3" className="submitForm rounded-right next-step">Next Step</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default GetStarted2;