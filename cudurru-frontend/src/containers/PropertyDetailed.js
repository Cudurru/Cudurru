import React, {useState, useEffect} from 'react';
import { processResponse, validateJWT } from "../middleware.js";
import {useParams, Link} from 'react-router-dom';
import { API_URL } from '../vars.js';
import bedIcon from "../assets/bed-icon.svg";
import bathIcon from "../assets/bath-icon.svg";
import sqftIcon from "../assets/sqft-icon.svg";
import DefaultImg from "../assets/default-image.jpg"
import yearBuiltIcon from "../assets/year-built-icon.svg";

import "../components/Button.scss"
import './PropertyDetailed.scss'
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-bootstrap';

export default function PropertyDetailed (props){
    const {id} = useParams();
    const [propertyObject, setPropertyObject] = useState(null);
    const [readMore, setReadMore] = useState({
        legalDescription: false,
        description: false,
    })
    const [maxLength, setMaxLength] = useState(255);
    const [errorObject, setErrorObject] = useState(null);
    const [imgPath, setImgPath] = useState(API_URL + '/static/')
    const [propertyEndpoint, setPropertyEndpoint] = useState(API_URL + '/api/property')
    const [responseStatus, setResponseStatus] = useState(null);
    const [isOwner, setIsOwner] = useState(null);
    // console.log(id);

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
                // console.log(res)
                const {statusCode, data} = res;
                if (statusCode === 200) {
                    setIsOwner(true);
                    // console.log("you are the owner!")
                }
                if(statusCode === 403){
                    setIsOwner(false)
                }
            }
        ).catch();
    }

    function renderReadMoreButton(name){
        if (!propertyObject[name] || (propertyObject[name].length < maxLength)){
            return ""
        }
        else {
            return (
                <button 
                    name={name} 
                    onClick={(e) => toggleReadMore(e.target)}
                    className="button-text"
                >
                    {`${readMore[name] ? "Read Less" : "Read More"}`}
                </button>
            )
        }        
    }

    function toggleReadMore(target){
        let name = target.name
        let readMoreObject = {...readMore};
        //Get the opposite
        readMoreObject[name] = !readMoreObject[name];
        setReadMore(readMoreObject);
    }

    function getAttribute(name){
        if(!propertyObject[name]){
            return ""
        }
        if(readMore[name]){
            // if readMore is true, return the full attribute
            return propertyObject[name]
        }
        else{
            // if readMore is false, return the slice from 0 to maxLength.
            return propertyObject[name].slice(0, maxLength);
            
        }
    }

    async function getProperty(){
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
                setResponseStatus(statusCode);
                if(statusCode === 200){
                    setPropertyObject(data.propertyData);
                }
                else {
                    setErrorObject(data)
                }
            }
        ).catch((error) => {
            setResponseStatus(500);
            console.log(error);
        })        
    }

    useEffect(()=>{
        checkForPermission();
        getProperty();
    },[]) // Empy array so it is only called on mount.
    // console.log(propertyObject);
    if((responseStatus === 200) &&  (propertyObject)) {
        // console.log("meo deos")
        return (        
            <div className="property-page">
                <div className="property-details">
                    {
                        isOwner ? 
                        <div className="edit-button"><Link className="button-primary" to={"/edit/address/" + id}>Edit your Listing</Link></div>
                        : "" 
                    }
                    <div className="header-container">
                        <h3 className="header-location">{
                            propertyObject.address1
                            + " "
                            + propertyObject.address2
                            + ", " + propertyObject.city
                            + ", " + propertyObject.state
                            + " "  + propertyObject.postalCode
                        }</h3>
                        <Carousel wrap={true} interval={null}>
                            {(propertyObject.assetList.length > 0) ?
                                    propertyObject.assetList.map((asset, index) => {
                                        return (
                                            <Carousel.Item interval={null}>
                                                <img className="d-block w-100" src={imgPath + asset.assetName} alt={asset.description}/>
                                            </Carousel.Item>
                                        )
                                    })
                                :
                                <Carousel.Item>
                                    <img className="d-block w-100" src={DefaultImg} alt="There are no images"/>
                                </Carousel.Item>
                            }
                        </Carousel>
                        <div className="header-footer">
                            <h2 className="header-footer-value">{"$" + propertyObject.askingPrice}</h2>
                            <div className="header-footer-rooms">
                                <div className="header-footer-item year-built">
                                    <img src={yearBuiltIcon} alt="Calendar icon" className="icon" />
                                        {`${propertyObject.yearBuilt ?
                                            propertyObject.yearBuilt + " sqft" :
                                            ""}`}
                                </div>
                                <div className="header-footer-item sqft">
                                    <img src={sqftIcon} alt="Ruler icon" className="icon" />
                                    {`${propertyObject.squareFootage ?
                                        propertyObject.squareFootage + " sqft" :
                                        ""}`}
                                </div>
                                <div className="header-footer-item beds">
                                    <img src={bedIcon} alt="Bed icon" className="icon" />
                                    {`${
                                        propertyObject.bedroomCount ?
                                        propertyObject.bedroomCount + ' beds' :
                                    ""}`}
                                </div>
                                <div className="header-footer-item baths">
                                    <img src={bathIcon} alt="Bath icon" className="icon" />
                                    {`${
                                        propertyObject.bathroomCount ?
                                        propertyObject.bathroomCount + ' baths':
                                    ""}`}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="property-additional-content">
                        {
                            isOwner ? "" : <button className="button-primary">Make Offer</button>
                        }                
                        <div className="property-description">
                            <div className="property-description-item">
                                <label htmlFor="property-description--description">Description: </label>
                                <div id="property-description--description" className="property-description--description">
                                    {getAttribute('description')}
                                </div>
                                {renderReadMoreButton('description')}
                            </div>
                            <div className="property-description-item">
                                <label htmlFor="property-description--legal-description">Legal Description: </label>
                                <div id="property-description--legal-description" className="property-description--legal-description">
                                    {getAttribute('legalDescription')}
                                </div>
                                {renderReadMoreButton('legalDescription')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
    else if (responseStatus >= 400){
        return(
            <div className="error-page">
                <div className="error-title">Error {status}:</div>
                <div className="error-details">{errorObject.details}</div>
            </div>
        )
    }
    else{
        return ""
    }
    
}