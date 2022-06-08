import React, {Component} from "react";
import { Link, useHistory } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";

import "../../components/Button.scss"
import "../../components/Input.scss"

import './GetStarted.scss'

class ListingDescription extends Component {
	constructor(props){
		super(props);
		this.validator = new SimpleReactValidator();
	}
	sendListingData = (event) => {
		const target = event.target;
		this.props.callbackFromParent(target);
	}

	render() {
		let descriptionErrorMessage = this.validator.message('description', this.props.dataFromParent.description, 'required|min:25|max:2000', { className: 'error-text error-text-textarea', messages:{min: `Description can't be smaller than 25 characters, you only have entered ${this.props.dataFromParent.description.length} characters.`, max: "Description can't be bigger than 2000 characters"}})
		let legalDescriptionErrorMessage = this.validator.message('legalDescription', this.props.dataFromParent.legalDescription, 'required|min:25|max:1000', { className: 'error-text error-text-textarea', messages:{min: `Legal description can't be smaller than 25 characters, you only have entered ${this.props.dataFromParent.legalDescription.length} characters.`, max: "Description can't be bigger than 1000 characters"}})
		
		return (
			<div className="get-started-wrapper main-content">
				<div className="progress-wrapper">
					<ol className="listing-progress-bar">
    					<li className="is-complete"><span>Address</span></li>
    					<li className="is-complete"><span>Characteristics</span></li>
    					<li className="is-complete"><span>Photos</span></li>
    					<li className="is-active"><span>Description</span></li>
							<li className="is-unstarted"><span>Review</span></li>
					</ol>
				</div>
				<div className="content">
					<h2>Listing's description</h2>
					<p>We'll use words to hightlight the best parts of your listing and describe it in detail.</p>
					<div className="short-desc input">
						<label className="input-label">Home description ({2000 - this.props.dataFromParent.description.length}) </label>
						<textarea 
							className={`textarea ${descriptionErrorMessage ? "input-with-error" : ""}`}  
							name="description" 
							onChange={this.sendListingData} 
							value={this.props.dataFromParent.description} 
							placeholder="Highlight the unique features of this listing." 
							onBlur={() => {this.validator.showMessageFor('description'); this.setState({check: true})}}

						/>
						{descriptionErrorMessage}
					</div>
					<div className="input">
						<label className="input-label">Legal description ({1000 - this.props.dataFromParent.legalDescription.length}) </label>
						<textarea 
							className={`textarea ${legalDescriptionErrorMessage ? "input-with-error" : ""}`} 
							placeholder="Enter Legal Description" 
							name="legalDescription" 
							value={this.props.dataFromParent.legalDescription} 
							onChange={this.sendListingData}
							onBlur={() => {this.validator.showMessageFor('legalDescription'); this.setState({check: true})}}

						/>
						{legalDescriptionErrorMessage}
					</div>
					<div className="nav-buttons">
						<Link to={this.props.lastLink} className="button-text submitForm rounded last-step">Last Step</Link>
						<Link 
							to={this.validator.allValid() ? this.props.nextLink : this.props.selfLink} 
							className="button-secondary submitForm rounded next-step"
							onClick={() => {this.validator.showMessages(); this.setState({check: true})}}
						>
							Review Listing
						</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default ListingDescription;