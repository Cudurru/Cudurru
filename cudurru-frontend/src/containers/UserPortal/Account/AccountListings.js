import React, {Component} from "react";
import { Link } from "react-router-dom";

import Sample1 from "../../../assets/homes/sample1.jpg";
import offersIcon from "../../../assets/offers-icon.png";
import viewingsIcon from "../../../assets/viewings-icon.png"

export default function AccountListings() {

    return (
        <li>
            <Link to="">
                <img src={Sample1} alt="" />
                <span className="street-address">{this.props.address}</span>
                <span className="location">{this.props.city}, {this.props.state} {this.props.zipcode}</span>
                <span className="offers"><img src={offersIcon} alt="" /> {this.props.offers}</span>
                <span className="viewings"><img src={viewingsIcon} alt ="" /> {this.props.viewings}</span>
            </Link>
        </li>
    );
}