import React, {useState, useEffect}from 'react';
import {useParams} from 'react-router-dom';
import {processResponse} from "../../middleware.js";
import {BrowserRouter as Router,
    Switch, Route,
    Redirect, Link,
    useHistory
} from 'react-router-dom'
import { API_URL } from '../../vars';

import ListingAddress from '../Onboarding/ListingAddress';
import ListingCharacteristics from '../Onboarding/ListingCharacteristics.js';
import ListingPhotos from '../Onboarding/ListingPhotos.js';
import ListingDescription from '../Onboarding/ListingDescription.js'
import ReviewListing from '../Onboarding/ReviewListing.js';
import UpdateData from './UpdateData'
import LoadingPage from '../LoadingPage.js';

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

export default function EditListing(props){
    const {page, id} = useParams();
    const [serverData, setServerData] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        bedroomCount: '',
        bathroomCount: '',
        squareFootage: '',
        description: '',
        imgUploads: [],
        legalDescription: '',
        yearBuilt: '',
        askingPrice: '',
        latitude: '',
        longitude: '',
        assetList: [],
    });
    const [isOwner, setIsOwner] = useState(null);
    const [canSubmit, setCanSubmit] = useState(false);
    const [editData, setEditData] = useState(serverData);
    const propertyEndpoint = API_URL + '/api/property';
    const linksObject = {
        address: "/edit/address/" + id,
        description: "/edit/description/" + id,
        photos: "/edit/photos/" + id,
        characteristics: "/edit/characteristics/" + id,
        review: "/edit/review/" + id,
        reviewAction: "/edit/update/" + id,
    }

    async function checkForPermission (){
        let jwt = await localStorage.getItem('jwt');
        fetch(propertyEndpoint + '/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                shashwmelsowje: "banana"
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer: ' + jwt,
            },
        }).then(processResponse)
        .then(
            (res) => {
                console.log(res)
                const {statusCode, data} = res;
                if (statusCode === 200) {
                    setIsOwner(true);
                }
                if(statusCode === 403){
                    setIsOwner(false)
                }
            }
        ).catch((error) => console.log(error));
    }

    function updateFileUploadState(index, state){
		var files = [...editData.imgUploads];
		files[index].uploadState = state;
		setEditData({...editData, imgUploads: files})
    }
    function getValidData(listingData){
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
    function handleInputChange(target){
        getValidData(target);
        setEditData({...editData, [target.name]: target.value})
    }
    function updateFileDescription(index, description) { 
		var files = [...editData.imgUploads];
		files[index].description = description;
		setEditData({...editData, imgUploads: files})
    }
    function unstageFile(index){
        var files = [...editData.imgUploads];
        files.splice(index, 1);
		setEditData({...editData, imgUploads: files})
    }
    function deleteFile(index, deleteFile){
        // stage file for deletion
        var files = [...editData.imgUploads];
		files[index].deleted = deleteFile;
		setEditData({...editData, imgUploads: files})
    }
    function closeAlert(){
		setEditData({...editData, alert: false});
	}
    function handleFileChange(target) {
		// var files = this.state.imgUploads.concat(target.files);
		let files = Array.from(target.files);
		files = files.map((file) => {
			file.uploadState = "notstarted";
			file.userInput = true;
			file.description = "";
			return file
        })
        let alert = editData.alert;
        files = files.filter((file) => {
			if(file.size > 25000000){
				alert = true;
				return false
			}
			return true
		})
		files = [...editData.imgUploads, ...files];
		setEditData({...editData, imgUploads: files, alert: alert})  
    }

    async function getServerData(){
        fetch(propertyEndpoint + '/' + id , {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then(processResponse)
        .then(
            res => {
                const {statusCode, data} = res;
                console.log(res);
                if(statusCode === 200){
                    setServerData(data.propertyData);
                }
            }
        ).catch((error) => {
            console.log(error);
        })        
    }
    useEffect(()=>{
        getServerData();
    },[])
    useEffect(()=>{
        setEditData({...serverData, imgUploads:serverData.assetList})
    },[serverData])
    useEffect(()=>{
        checkForPermission();
        setCanSubmit(true);
    },[editData])
    // console.log(page);

    if(isOwner === null) {
    // if(true){
        return <LoadingPage message="We are gathering your listing"/>
    }
    if(isOwner === false){
        return (
            <Redirect to={"/property/" + id}/>
        )
    }
    if(page === 'address'){
        return (            
            <ListingAddress
                dataFromParent={editData}
                handleInputChange={handleInputChange}
                title="Edit your Listing Address"
                subtitle="Enter the address with a street number to update your address information."
                nextLink={"/edit/characteristics/" + id}
                selfLink={'/edit/address/' + id}
            />   
        )
    }
    if(page === 'characteristics'){
        return (
            <ListingCharacteristics
                callbackFromParent={handleInputChange} 
                dataFromParent={editData}
                title="Edit Listing Details"
                lastLink={"/edit/address/" + id}
                selfLink={'/edit/characteristics/' + id}
                nextLink={"/edit/photos/" + id}
            />
        )
    }
    if(page === 'photos'){
        return (
            <ListingPhotos
                dataFromParent={editData}
                stageFiles={handleFileChange}
                unstageFile={unstageFile}
                deleteFile={deleteFile}
                closeAlert={closeAlert}
                updateFileDescription={updateFileDescription}
                lastLink={"/edit/characteristics/" + id}
                nextLink={"/edit/description/" + id}
            />
        )
    }
    if(page === 'description'){
        return (
            <ListingDescription
                dataFromParent={editData}
                callbackFromParent={handleInputChange}
                lastLink={"/edit/photos/" + id}
                selfLink={"/edit/description/" + id}
                nextLink={"/edit/review/" + id}
            />
        )
    }
    if(page === 'review'){
        return(
            <ReviewListing
                dataFromParent={editData}
                actionText="Update Listing"
                links={linksObject}
            />
        )
    }
    if(page === 'update'){

        if(canSubmit === true){
            return (
                <UpdateData
                    dataFromParent={editData}
                    canUpdate={canSubmit}
                    updateFileUploadState={updateFileUploadState}
                    links={linksObject}
                />
            )
        }
        else {
            return <Redirect to={linksObject.review}/>
        }
    }
    return null;
}