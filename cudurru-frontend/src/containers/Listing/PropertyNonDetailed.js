import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import PropertiesList from './PropertiesList'
import {API_URL} from "../../vars";
import DefaultImg from "../../assets/default-image.jpg"
import bedIcon from "../../assets/bed-icon.svg";
import bathIcon from "../../assets/bath-icon.svg";
import sqftIcon from "../../assets/sqft-icon.svg";

import './PropertyNonDetailed.scss'
export default function PropertyNonDetailed (props){
    const [imgPath, setImgPath] = useState(API_URL + '/static/')
    return (
        <div className="property-non-detailed">
            {props.deleteButton ? 
                <Link 
                    className="button-text property-non-detailed--delete"
                    to={"/delete-listing/" + props.propertyObject.uuid}
                >
                    Delete this listing
                </Link>
                : ""
            }
            <Link className="property-non-detailed--link" to={"/property/" + props.propertyObject.uuid}>
                <div className="property-non-detailed--img">
                    {
                        props.propertyObject.assetList.length > 0 ?
                        <img src={imgPath + props.propertyObject.assetList[0].assetName } alt="Property Img"/>
                        : <img src={DefaultImg} alt="Default Img"/>
                    }
                </div>
                <div className="property-non-detailed--price">
                    {`${props.propertyObject.askingPrice ?
                    "$" + props.propertyObject.askingPrice :
                    ""}`}
                </div>
                <div className="property-non-detailed--details">
                    <div className="details--rooms">
                        <div className="sqft">
                        <img src={sqftIcon} alt="Ruler icon" className="icon" />
                        {`${props.propertyObject.squareFootage ?
                            props.propertyObject.squareFootage + " sqft" :
                            ""}`}
                        </div>
                        <div className="beds">
                            <img src={bedIcon} alt="Bed icon" className="icon" />
                            {`${
                                props.propertyObject.bedroomCount ?
                                props.propertyObject.bedroomCount + ' beds' :
                            ""}`}
                        </div>
                        <div className="baths">
                            <img src={bathIcon} alt="Bath icon" className="icon" />
                            { `${
                                props.propertyObject.bathroomCount ?
                                props.propertyObject.bathroomCount + ' baths':
                            ""}`}
                        </div>
                    </div>
                    <div className="details--address">
                        <div>
                            {`${props.propertyObject.address1 ?
                            props.propertyObject.address1 :
                            ""}`}
                        </div>
                        <div>
                            {`${props.propertyObject.city ?
                            props.propertyObject.city :
                            ""}, ${props.propertyObject.state ?
                                props.propertyObject.state :
                                ""}`}
                        </div>
                        <div>
                            {`${props.propertyObject.postalCode ?
                            props.propertyObject.postalCode :
                            ""}`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}