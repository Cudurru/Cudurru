import React, {Component} from "react";
import {  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter} from "react-router-dom";

import MainMenu from "./Account/MainMenu";
import AccountListings from "./Account/AccountListings";
import ListingOffers from "./Account/ListingOffers";
import SellersChecklist from "./Account/SellersChecklist";
import BuyersChecklist from "./Account/BuyersChecklist";
import ShowingRequests from "./Account/ShowingRequests";

class UserPortal extends Component {

    render() {
    return (
    <div className="user-portal main-content">
        <div className="left-sidebar">
    		<MainMenu />
        	<div className="your-listings panel">
        		<h2>Your Listings</h2>
        		<ul>
                    <AccountListings />                    
        		</ul>
        	</div>
        </div>
        <div className="right-content">
            <SellersChecklist />
            <BuyersChecklist />
        </div>
	</div>
    );
}
}

export default UserPortal;