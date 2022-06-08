import React, {Component} from "react";
import { Link, useHistory } from "react-router-dom";

import BackButton from "../../components/BackButton";

class GetStarted6 extends Component {
	sendListingData = (event) => {
		const target = event.target;
        const value = target.value;
        const name = target.name;
		this.props.callbackFromParent(target);
		this.props.callbackFromParent(value);
		this.props.callbackFromParent(name); 
    }

	render() {
		return (
			<div className="get-started-wrapper main-content">
				<div className="header">
					<ol className="progress-bar">
    					<li className="is-complete"><span>Confirm Address</span></li>    
    					<li className="is-complete"><span>Prep Listing</span></li>
    					<li className="is-active"><span>Review Listing</span></li>  
    					<li className="is-active"><span>Success</span></li>
					</ol>
				</div>
			<div className="content">
				<h2>Upload Documents</h2>
				<p>Please upload your sellers disclosure.</p>
				<div className="uploadPhoto">
					<div className="field-wrapper">
						<button className="upload-btn"></button>
						<input type="file" name="disclosure" onChange={this.handleInputChange} />
					</div>
					<BackButton />	
					<Link to="/sell/get-started/5" className="submitForm rounded next-step">Next Step</Link>
				</div>
			</div>
		</div>
		)
	}
}

export default GetStarted6;