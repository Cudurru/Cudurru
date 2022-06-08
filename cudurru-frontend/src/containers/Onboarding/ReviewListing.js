import React, {Component} from "react";
import { Link } from "react-router-dom";

import './../../components/Input.scss'
import './../../components/Button.scss'

import "./GetStarted.scss"
import "./ReviewListing.scss"
import { API_URL } from "../../vars";


class ReviewListing extends Component {

	renderImages(){
		// console.log(this.props.dataFromParent.imgUploads)
		let photoUrl = API_URL + '/static'
		return (
		<div className="review-photos">
			{this.props.dataFromParent.imgUploads.map((file, index) => {
				return(<div key={index} >
					<img 
						src={file.userInput ? URL.createObjectURL(file) : photoUrl + "/" + file.assetName } 
						alt="Image file"
						className={`${file.deleted ? "will-be-deleted" : ""}`}	
					/>
				</div>);
			}
		)}
		</div>)
	}
	render() {
		return (
			<div className="get-started-wrapper main-content">
				<div className="progress-wrapper">
					<ol className="listing-progress-bar">
    					<li className="is-complete"><span>Address</span></li>
    					<li className="is-complete"><span>Characteristics</span></li>
    					<li className="is-complete"><span>Photos</span></li>
    					<li className="is-complete"><span>Description</span></li>
							<li className="is-active"><span>Review</span></li>
					</ol>
				</div>
				<div className="content">
					<h2>Review your listing</h2>
					<div className="review">
						<div className="listing-data-section">
							<div className="listing-title">Address</div>
							<Link className="edit-link" to={this.props.links.address}>Edit</Link>
							<div className="listing-data"> Address1: 	<div>{this.props.dataFromParent.address1} 	</div></div>
							<div className="listing-data"> Address 2: 	<div>{this.props.dataFromParent.address2}	</div></div>
							<div className="listing-data"> City: 		<div>{this.props.dataFromParent.city} 		</div></div>
							<div className="listing-data"> State: 		<div>{this.props.dataFromParent.state}		</div></div>
							<div className="listing-data">Postal Code: 	<div>{this.props.dataFromParent.postalCode}</div></div>
						</div>
						<div className="listing-data-section">
							<div className="listing-title">Characteristics</div>
							<Link className="edit-link" to={this.props.links.characteristics}>Edit</Link>
							<div className="listing-data">Bedrooms: 			<div>{this.props.dataFromParent.bedroomCount}</div></div>
							<div className="listing-data">Bathrooms: 		<div>{this.props.dataFromParent.bathroomCount}</div></div>
							<div className="listing-data">Square Footage: 	<div>{this.props.dataFromParent.squareFootage}</div></div>
							<div className="listing-data">Lot Size: 			<div>{this.props.dataFromParent.lotSize}</div></div>
							<div className="listing-data">Price: 			<div>{this.props.dataFromParent.askingPrice}</div></div>
							<div className="listing-data">Year Built: 		<div>{this.props.dataFromParent.yearBuilt}</div></div>
						</div>
						<div className="listing-data-section">
							<div className="listing-title">Photos</div>
							<Link className="edit-link" to={this.props.links.photos}>Edit</Link>
							{this.props.dataFromParent.imgUploads.length > 0 ? this.renderImages() : <div className="listing-data">You haven't added any photos</div> }
						</div>
						<div className="listing-data-section">
							<div className="listing-title">Listing Description</div>
							<Link className="edit-link" to={this.props.links.description}>Edit</Link>
							<div className="listing-data">Description: <div>{this.props.dataFromParent.description}</div></div>
							<div className="listing-data">Legal Description: <div>{this.props.dataFromParent.legalDescription}</div></div>
						</div>
						{/* <div className="">
							<span>Beds: {this.props.beds}</span>
							<Link className="edit-link" to="/sell/get-started/2">Edit</Link>
						</div>
						<div className="">
							<span>Baths: {this.props.baths}</span>
							<Link className="edit-link" to="/sell/get-started/2">Edit</Link>
						</div>
						<div className="">
							<span>Square Footage: {this.props.sqft}</span>
							<Link className="edit-link" to="/sell/get-started/2">Edit</Link>
						</div>
						<div className="">
							<span>Price: {this.props.price}</span>
							<Link className="edit-link" to="/sell/get-started/2">Edit</Link>
						</div>
						<div className="">
							<span>Description: {this.props.desc}</span>
							<Link className="edit-link" to="/sell/get-started/5">Edit</Link>
						</div>
						<div className="">
							<span>Images: {this.props.imgSrc}<br />
							{this.props.imgSrc2}<br />
							{this.props.imgSrc3}<br />
							{this.props.imgSrc4}<br />
							{this.props.imgSrc5}
							</span>
							<Link className="edit-link" to="/sell/get-started/3">Edit</Link>
						</div> */}
						{/* <div className="">
							<span>Disclosure File: {this.props.disclosure}</span>
							<Link className="edit-link" to="/sell/get-started/4">Edit</Link>
						</div> */}
						<div className="nav-buttons">
							<Link className="button-text" to={this.props.links.description}>Previous step</Link>
							<Link className="button-secondary" to={this.props.links.reviewAction}>{this.props.actionText}</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ReviewListing;