import React, {Component} from "react";
import { Link, useHistory } from "react-router-dom";
import Autocomplete from 'react-google-autocomplete';
import GoogleMapReact from 'google-map-react';

import "../../components/Button.scss"
import "../../components/Input.scss"

import './GetStarted.scss'
import "./ListingAddress.scss"
import "./SuperPin.scss"

function getComponent(addressComponents, type){
	return addressComponents.filter((component) => {
		return component.types.includes(type)
	})[0]
}

function Marker(props) {
	return <>
				<div className="pin"></div>
				<div className="pulse"></div>
		   </>
}
class ListingAddress extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addressError: null
		}
	}
	renderMarkers = (map, maps) => {
		let marker = new maps.Marker({
		position: { lat: this.props.dataFromParent.latitude, lng: this.props.dataFromParent.longitude },
		map,
		title: 'Hello World!'
		});
		return marker;
	   };
	sendListingData = (name, value) => {
		const target = {name: name, value:value};
		this.props.handleInputChange(target);
    }

	render() {
		// console.log(this.props.dataFromParent);
		let center = {
			lat: this.props.dataFromParent.latitude,
			lng: this.props.dataFromParent.longitude
		}
		// console.log(center);
		return (
			<div className="get-started-wrapper main-content">
				<div className="progress-wrapper">
					<ol className="listing-progress-bar">
    					<li className="is-active"><span>Address</span></li>
    					<li className="is-unstarted"><span>Characteristics</span></li>
    					<li className="is-unstarted"><span>Photos</span></li>
    					<li className="is-unstarted"><span>Description</span></li>
							<li className="is-unstarted"><span>Review</span></li>
					</ol>
				</div>
				<div className="content">
					<h2 className="title">{this.props.title}</h2>
					<p className="subtitle">{this.props.subtitle}</p>
						<div className="input">
							<label className="input-label">Enter your listing's location</label>
							<Autocomplete
								onPlaceSelected={(place) => {
									let components = place.address_components;
									// console.log(place);
									// console.log(place.geometry.location.lat());
									// console.log(place.geometry.location.lng());
									let route = getComponent(components, 'route');
									let streetNumber = getComponent(components, 'street_number');
									let city = getComponent(components, 'locality');
									let state = getComponent(components, 'administrative_area_level_1');
									let postalCode = getComponent(components, 'postal_code');
									// console.log(route);
									if(!streetNumber){
										streetNumber = {long_name: ''};
										postalCode = {long_name: ''};
										this.setState({addressError: 'Input a  valid street number in your address'});
									}
									else {
										this.setState({addressError: null });
									}
									this.sendListingData('address1', streetNumber.long_name + ' ' + route.long_name);
									this.sendListingData('city', city.long_name);
									this.sendListingData('state', state.long_name);
									this.sendListingData('postalCode', postalCode.long_name);
									this.sendListingData('latitude', place.geometry.location.lat());
									this.sendListingData('longitude', place.geometry.location.lng());
								}}
								className={`${this.state.addressError ? "input-with-error" : ""} text-input`}
								types={['address']}
								componentRestrictions={{country: "us"}}
							/>
							<div className={`error-text ${this.state.addressError ? 'show' : ''}`}>
								{this.state.addressError}
							</div>
						</div>
						<div className="input">
							<label className="input-label">Address 1</label>
							<input type="text" disabled className="text-input" name="address1" placeholder="Address" value={this.props.dataFromParent.address1} onChange={this.sendListingData} />
						</div>
						<div className="input">
							<label className="input-label">Address 2</label>
							<input type="text" className="text-input" name="address2" placeholder="Apt, etc." value={this.props.dataFromParent.address2} onChange={(e)=> this.sendListingData(e.target.name, e.target.value)} />
						</div>
						<div className="input">
							<label className="input-label">City</label>
							<input type="text" disabled  className="text-input" name="city" placeholder="City" value={this.props.dataFromParent.city} onChange={this.sendListingData} />
						</div>
						<div className="input">
							<label className="input-label">State</label>
							<input type="text" disabled className="text-input" name="state" placeholder="State" value={this.props.dataFromParent.state} onChange={this.sendListingData} />
						</div>
						<div className="input last-row">
							<label className="input-label">Postal Code</label>
							<input type="text" disabled className="text-input" name="postalCode" placeholder="Postal Code" value={this.props.dataFromParent.postalCode} onChange={this.sendListingData} />
						</div>
						{/* {((this.props.dataFromParent.latitude != "") && this.props.loadMap) ?
							<div style={{height: 300}}>
								<GoogleMapReact
									center={center}
									defaultZoom={11} >
									<Marker lat={this.props.dataFromParent.latitude} lng={this.props.dataFromParent.longitude}/>
								</GoogleMapReact>
							</div> :
							''
						} */}
						<div className="nav-buttons nav-buttons--end">
							<Link
								to={(this.state.addressError) || (this.props.dataFromParent.address1 === "") ? this.props.selfLink : this.props.nextLink}
								className="button-secondary next-step"
								onClick={() =>{
									if(this.props.dataFromParent.address1 === ""){
										this.setState({addressError: 'Choose a valid address.'});
									}
								}}
							>
								Next Step
							</Link>
						</div>
					</div>
				</div>
		)
	}
}

export default ListingAddress;