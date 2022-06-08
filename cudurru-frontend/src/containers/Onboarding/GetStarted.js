import React, {Component} from "react";
import {  BrowserRouter as Router,
  Switch,
  Route, Redirect,
  Link, useHistory
 } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
import {isLoggedIn} from '../../middleware.js';

import ListingAddress from "./ListingAddress";
import ListingCharacteristics from "./ListingCharacteristics";
import ListingPhotos from "./ListingPhotos";
import ListingDescription from "./ListingDescription";
import GetStartedSuccess from "./GetStartedSuccess";
import ReviewListing from "./ReviewListing";
import SubmitData from "./SubmitData.js";

import './GetStarted.scss'

const linksObject = {
	address: "/sell/get-started",
	description: "/sell/get-started/5",
	photos: "/sell/get-started/3",
	characteristics: "/sell/get-started/2",
	review: "/sell/get-started/review-listing",
	reviewAction: "/sell/get-started/submit-data",
}
const configValidationObject = {
	address1: {maxLength: Number.POSITIVE_INFINITY, minLength: 1, type: "text", required: true, label: "Address 1"},
	address2: {maxLength: 255, minLength: 0, type: "text", required: false, label: "Address 2"},
	city: {maxLength: Number.POSITIVE_INFINITY, minLength: 0, type: "text", label: "City"},
	state: {maxLength: Number.POSITIVE_INFINITY, minLength: 0, type: "text", required: false, label: "State"},
	postalCode: {maxLength: Number.POSITIVE_INFINITY, minLength: 0, type: "text", required: false, label: "Postal Code"},
	bedroomCount: {maxValue: 150, minValue: 0, type: "number", required: false, label: "Bedrooms"}, 
	bathroomCount: {maxValue: 150, minValue: 0, type: "number", required: false, label: "Bathrooms"},
	squareFootage: {maxValue: 10000000, minValue: 0, type: "number", required: false, label: "Square Footage"},
	lotSize: {maxValue: 10000000, minValue: 0, type: "number", required: false, label: "Lot Size"},
	yearBuilt: {maxValue: 2020, minValue: 0, type: "number", required: false, label: "Year Built"},
	askingPrice: {maxValue: 100000000, minValue: 0, type: "number", required: true, label: "Price"},
	description: {maxLength: 2000, minLength: 25, type: "text", required: true, label: "Description"},
	legalDescription: {maxLength: 1000, minLength: 25, type: "text", required: true, label: "Legal Description"},
	latitude: {maxValue: Number.POSITIVE_INFINITY, minValue: Number.NEGATIVE_INFINITY, type: "number", required: false},
	longitude: {maxValue: Number.POSITIVE_INFINITY, minValue: Number.NEGATIVE_INFINITY, type: "number", required: false},
	imgUploads: {maxSize: 25000000, type: "file", required: false}
}
const errorMessagesConfigs = {
	address1: {
		isRequired: {message: 'Please provide a valid street address.'}
	},
	address2: {
		isMaxLength: {
			value: configValidationObject['address2'].maxLength,
			message: `Address 2 can't be bigger than ${configValidationObject['address2'].maxLength}`
		}
	},
	askingPrice: {
		isRequired: {message: "Please provide the Price of your listing."}
	},
	legalDescription: {
		isRequired: {message: "Please provide a Legal description for your listing."},
		isMinLength: {
			value: configValidationObject['legalDescription'].minLength,  
			message: `Your Legal description can't be shorther than ${configValidationObject['legalDescription'].minLength} characters.`
		},
		isMaxLength: {
			value: configValidationObject['legalDescription'].maxLength,
			message: `Your Legal description can't be bigger than ${configValidationObject['legalDescription'].maxLength} characters.`
		}
	},
	description: {
		isRequired: {message: "Please provide a description for your listing."},
		isMinLength: {
			value: configValidationObject['description'].minLength,
			message: `Your description can't be shorter than ${configValidationObject['description'].minLength} characters.`
		},
		isMaxLength: {
			value: configValidationObject['description'].maxLength,
			message: `Your description can't be bigger than ${configValidationObject['description'].maxLength} characters.`
		}
	},
	imgUploads: {
		isMaxValue: {
			value: 25000000,
			message: "File is too big, please remove. (25MB limit)."
		}
	},
}

class GetStarted extends Component {
	constructor(props) {
		super(props);
		this.state = {				
			address1: '',
			address2: '',
			city: '',
			state: '',
			postalCode: '',
			bedroomCount: '',
			bathroomCount: '',
			squareFootage: '',
			description: '',
			lotSize: '',
			legalDescription: '',
			yearBuilt: '',
			askingPrice: '',
			latitude: '',
			longitude: '',
			imgUploads: [],		
		}
		this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.maxSelectImgs = this.maxSelectImgs.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.enableButton = this.enableButton.bind(this);
		this.validator = new SimpleReactValidator();
		this.unstageFile = this.unstageFile.bind(this);
		this.updateFileDescription = this.updateFileDescription.bind(this);
		this.updateFileUploadState = this.updateFileUploadState.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
	}
	closeAlert(){
		this.setState({alert: false});
	}
    componentDidMount() {
       
    }

	unstageFile(index){
		var files = [...this.state.imgUploads];
		files.splice(index, 1);
		this.setState({imgUploads: files});
		// console.log(this.state);
	}
	updateFileUploadState(index, state){
		var files = [...this.state.imgUploads];
		files[index].uploadState = state;
		this.setState({imgUploads: files});
		// console.log(this.state);
	}
	updateFileDescription(index, description) {
		var files = [...this.state.imgUploads];
		files[index].description = description;
		this.setState({imgUploads: files});
		// console.log(this.state);
	}
	getValidData(listingData){
		let name = listingData.name;
		let value = listingData.value;
		let validationObject = configValidationObject[name];
		if (validationObject.type === "number"){
			if(validationObject.minValue > parseInt(value)){
				listingData.value = validationObject.minValue;
			}
			if(validationObject.maxValue < parseInt(value)){
				listingData.value = validationObject.maxValue;
			}
		}
	}
	// isProvided(field){
	// 	if(field && (field != "")){
	// 		return true
	// 	}
	// 	return false
	// }
	// validateNumber(fieldName, validationObject){
		
	// 	if(errorMessagesConfigs[fieldName]){
	// 		if(errorMessagesConfigs[fieldName].isRequired){
	// 			if(!this.isProvided(this.state[fieldName])){					
	// 				// We have an error, return message error.
	// 				return errorMessagesConfigs[fieldName].isRequired.message					
	// 			}
	// 		}
	// 	}
	// 	return null
	// }
	// validateData(){
	// 	let validation = {...this.state.validation};
	// 	for (var [fieldName, validationObject] of Object.entries(configValidationObject)){
	// 		let type = validationObject.type;
	// 		let errorMessage = null;
	// 		console.log(`validating ${fieldName}`)
	// 		if(type === 'number'){
	// 			errorMessage = this.validateNumber(fieldName, validationObject);
	// 		}
	// 		if(type === 'text'){
	// 			// this.validateText(fieldName, validationObject);
	// 		}
	// 		if(type === 'file'){
	// 			// this.validadeFiles(fieldName, validationObject);
	// 		}
	// 		validation[fieldName].message = errorMessage;
	// 	}
	// 	this.setState({...this.state, validation: validation});
	// }

	handleInputChange(listingData) {
		this.getValidData(listingData);
        this.setState(prevState => ( { ...prevState, [listingData.name]: listingData.value
           }), () => { /*console.log(this.state);*/}
        );
    }

    handleFileChange(target) {
		// var files = this.state.imgUploads.concat(target.files);
		let files = Array.from(target.files);
		files = files.map((file) => {
			file.uploadState = "notstarted";
			file.userInput = true;
			file.description = null;
			return file
		})
		files = files.filter((file) => {
			if(file.size > 25000000){
				this.setState({alert: true});
				return false
			}
			return true
		})
		files = [...this.state.imgUploads, ...files];
		this.setState(prevState => ( { ...prevState, imgUploads: files
		}), () => { /*console.log(this.state) */});
  
    }

	disableButton() {
        this.setState({ canSubmit: false });
    }

    enableButton() {
        this.setState({ canSubmit: true });

    }

    maxSelectImgs = (target) => {
   		let files = target.files // create file object
    		if (files.length > 3) { 
        		const msg = 'Only 5 images can be uploaded to a listing at this time'
        		event.target.value = null // discard selected file
        		// console.log(msg)
        	return false;
    		}
		return true;

	}

    onSubmit() {
    	for(var x = 0; x<this.state.imgUploads.length; x++) {
       		data.append('file', this.state.imgUploads[x])
   		}

        // console.log('submitting');
        if (this.validator.allValid()) {
            // call the api
        } else {
        this.validator.showMessages();
        // rerender to show messages for the first time
        // you can use the autoForceUpdate option to do this automatically`
        }
    }

	render() {
		// console.log(this.props.isLoggedIn)
        if (this.props.isLoggedIn === false) {
            return <Redirect to='/login' />
		}
		// console.log(SubmitData)
	   return(

		<Switch>
			<Route exact path="/sell/get-started">
				<ListingAddress handleInputChange={this.handleInputChange} 
							dataFromParent={this.state}
							title="Get Started With Cudurru"
							subtitle="Enter your address with street number to sell your home and save thousands in commissions and fees!"
							nextLink="/sell/get-started/2"
							selfLink="/sell/get-started"
							loadMap
							/>
			</Route>
			<Route path="/sell/get-started/2">
				<ListingCharacteristics callbackFromParent={this.handleInputChange} 
							dataFromParent={this.state}
							title="Listing Details"
							lastLink="/sell/get-started"
							selfLink="/sell/get-started/2"
							nextLink="/sell/get-started/3"	
							/>
			</Route>
			<Route path="/sell/get-started/3">
				<ListingPhotos stageFiles={this.handleFileChange}
							unstageFile={this.unstageFile}
							updateFileDescription={this.updateFileDescription} 
							dataFromParent={this.state}
							closeAlert={this.closeAlert} 
							nextLink="/sell/get-started/5"
							selfLink="/sell/get-started/3"
							lastLink="/sell/get-started/2"
							/>
			</Route>
			{/* <Route path="/sell/get-started/4">
				<GetStarted6 callbackFromParent={this.handleInputChange} 
							dataFromParent={this.state} />
			</Route> */}
			<Route path="/sell/get-started/5">
				<ListingDescription 
									callbackFromParent={this.handleInputChange} 
									dataFromParent={this.state} 
									lastLink="/sell/get-started/3"
									selfLink="/sell/get-started/5"
									nextLink="/sell/get-started/review-listing"
									/>
			</Route>
			<Route path="/sell/get-started/success">
				<GetStartedSuccess />
			</Route>
			<Route path="/sell/get-started/review-listing">
				<ReviewListing 
					dataFromParent={this.state} 
					actionText="Create Property"
					links={linksObject}
				/>
			</Route>
			<Route path="/sell/get-started/submit-data">
				<SubmitData 
					links={linksObject}
					dataFromParent={this.state}
					updateFileUploadState={this.updateFileUploadState}
				/>
				
			</Route>
		</Switch>

	   	)
	}
}

export default GetStarted;