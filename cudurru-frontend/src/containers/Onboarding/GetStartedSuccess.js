import React, {Component} from "react";
import { Link } from "react-router-dom";

import Sample1 from "../../assets/homes/sample1.jpg";

class GetStartedSuccess extends Component {
	render() {
		return (
			<div className="get-started-wrapper main-content">
			<div className="content">
					<h2>Success! <br/>Your home is listed.</h2>
					<div className="successPhoto">
						<div className="photo"><img src={Sample1} alt="Your home listing!" /></div>
						<Link className="rounded save-progress">Account Portal</Link>
						<Link className="rounded next-step">View Listing</Link>
					</div>
			</div>
		</div>
		)
	}
}

export default GetStartedSuccess;