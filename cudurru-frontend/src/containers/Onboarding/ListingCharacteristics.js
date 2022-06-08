import React, {Component} from "react";
import { Link, useHistory } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";

import "../../components/Input.scss";

import './GetStarted.scss';
import './ListingCharacteristics.scss';

class ListingCharacteristics extends Component {
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
	}
	sendListingData = (event) => {
		const target = event.target;
        const value = target.value;
        const name = target.name;
		// console.log(target);
		this.props.callbackFromParent(target);

		// this.props.callbackFromParent(value);
		// this.props.callbackFromParent(name);
    }

	render() {
		// console.log(this.validator);
		let askingPriceErrorMessage = this.validator.message('askingPrice', this.props.dataFromParent.askingPrice, 'required', { className: 'error-text error-text--absolute-position' });
		return (
			<div className="get-started-wrapper main-content">
				<div className="progress-wrapper">
					<ol className="listing-progress-bar">
    					<li className="is-complete"><span>Address</span></li>
    					<li className="is-active"><span>Characteristics</span></li>
    					<li className="is-unstarted"><span>Photos</span></li>
    					<li className="is-unstarted"><span>Description</span></li>
							<li className="is-unstarted"><span>Review</span></li>
					</ol>
				</div>
				<div className="content listing-characteristics">
					<h2 className="title">{this.props.title}</h2>
					<div className="home-details">
						<div className="input">
							<label className="input-label">Bedrooms</label>
							<input type="number" className="number-input" name="bedroomCount" placeholder="Enter beds" value={this.props.dataFromParent.bedroomCount} onChange={this.sendListingData} />
						</div>
						<div className="input">
							<label className="input-label">Bathrooms</label>
							<input type="number" className="number-input" name="bathroomCount" placeholder="Enter baths" value={this.props.dataFromParent.bathroomCount} onChange={this.sendListingData} />
						</div>
						<div className="input">
							<label className="input-label">Square Footage</label>
							<input type="number" className="number-input" placeholder="Enter square footage" name="squareFootage" value={this.props.dataFromParent.squareFootage} onChange={this.sendListingData} />
						</div>
						<div className="input">
							<label className="input-label"> Lot Size </label>
							<input type="number" className="number-input" placeholder="Enter Lot Size" name="lotSize" value={this.props.dataFromParent.lotSize} onChange={this.sendListingData} />
						</div>
						<div className="input">
							<label className="input-label"> Year Built </label>
							<input type="number" className="number-input" placeholder="Enter Year Built" name="yearBuilt" value={this.props.dataFromParent.yearBuilt} onChange={this.sendListingData} />
						</div>
						<div className="input">
							<label className="input-label">Price ($)*</label>
							<input
								type="number"
								className={`number-input ${ askingPriceErrorMessage ? "input-with-error" : ""}`}
								name="askingPrice"
								placeholder="Enter price"
								value={this.props.dataFromParent.askingPrice}
								onBlur={() => {this.validator.showMessageFor('askingPrice'); this.setState({check: true})}}
								onChange={this.sendListingData}
							/>
							{askingPriceErrorMessage}
						</div>
					</div>
					<div className="nav-buttons">
						<Link to={this.props.lastLink} className="button-text submitForm rounded last-step">Previous Step</Link>
						<Link
							to={this.validator.allValid() ? this.props.nextLink : this.props.selfLink}
							className="button-secondary submitForm rounded next-step"
							onClick={() => {this.validator.showMessages(); this.setState({check: true})}}
						>
							Next Step
						</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default ListingCharacteristics;