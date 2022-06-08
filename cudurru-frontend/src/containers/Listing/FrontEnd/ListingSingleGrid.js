import React, {Component} from "react";
import {  BrowserRouter as Router,
  Switch,
  Route,
  Link, withRouter
 } from "react-router-dom";

import imgSrc from "../../../assets/homes/sample1.jpg";
import imgSrc2 from "../../../assets/homes/sample2.png";
import imgSrc3 from "../../../assets/homes/sample3.jpg";
import imgSrc4 from "../../../assets/homes/sample4.jpg";
import imgSrc5 from "../../../assets/homes/sample5.jpg";


class ListingSingleGrid extends Component {

		render() {
			let streetAddress2Grid = "";      	
        	if(this.props.home.streetAddress2 !== null) {
           		streetAddress2Grid =", " + this.props.home.streetAddress2;
        	}
			
			return (
    			<Link key={this.props.home.id} to={"listings/" + this.props.home.id} onClick={this.updateActiveVars} className="single-home">
    				<img src={this.props.home.src} className="home-featured-img" alt="" />
    				<span className="home-details"> 
    					<span className="home-price">${this.props.home.price}</span>
    					<span className="home-attributes">{this.props.home.beds} bd | {this.props.home.baths} ba | {this.props.home.sqft} sqft</span>
    					<span className="home-grid-clear"></span>
    				</span>		
    				<span className="home-address">{this.props.home.streetAddress + streetAddress2Grid} {this.props.home.city}, {this.props.home.state} {this.props.home.zip}</span>
				</Link> 
		);
	}
}

export default ListingSingleGrid;