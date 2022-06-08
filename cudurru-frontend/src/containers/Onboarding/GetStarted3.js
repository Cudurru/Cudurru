import React, {Component} from "react";
import { Link, useHistory } from "react-router-dom";

class GetStarted3 extends Component {
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
					<h2>Verify Your Phone Number</h2>
					<p>We need to verify your phone number to provide the best user experience. You will receive a text message.</p>
					<div className="search-input">
						<input type="phone" placeholder="(555)-555-5555" name="phone" className="rounded-left" />
						<Link to="/sell/get-started/3" className="submitForm rounded-right next-step">Next Step</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default GetStarted3;