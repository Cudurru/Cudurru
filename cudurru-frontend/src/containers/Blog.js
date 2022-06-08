import React from "react";
import {  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams} from "react-router-dom";

import Sample1 from "../assets/homes/sample1.jpg"; 

export default function Blog(){
    return (
    <div className="user-portal main-content">
        <div className="left-sidebar">
        	<div className="main-menu panel">
        		<h2>Hi! NAME</h2>
        		<ul>
        			<li><Link to="">Account Info</Link></li>
        			<li><Link to="">Account Preferences</Link></li>
        			<li><Link to="">Provide Feedback</Link></li>
        		</ul>
        	</div>
        	<div className="your-listings panel">
        		<h2>Your Listings</h2>
        		<ul>
        			<li><Link to=""><img src={Sample1} alt="" /><span className="street-address">1440 Virginia Park St.</span><span className="location">Detroit, MI 48206</span></Link></li>
        			<li><Link to=""><img src={Sample1} alt="" /><span className="street-address">1440 Virginia Park St.</span><span className="location">Detroit, MI 48206</span></Link></li>
        			<li><Link to=""><img src={Sample1} alt="" /><span className="street-address">1440 Virginia Park St.</span><span className="location">Detroit, MI 48206</span></Link></li>
        		</ul>
        	</div>
        	<div className="offers panel">
        		<h2>Offers</h2>
        		<ul>
        			<li><span>Offer 1</span><Link to="" className="btn">View Offer</Link></li>
        			<li><span>Offer 2</span><Link to="" className="btn">View Offer</Link></li>
        			<li><span>Offer 3</span><Link to="" className="btn">View Offer</Link></li>
        		</ul>
        	</div>
        </div>
        <div className="right-content">
        	<div className="sellers-checklist panel">
        		<h2>Seller's Checklist</h2>
        		<p>For PROPERTY ADDRESS.</p>
        		<p>Complete the following steps to close your home sale on Cudurru.</p>
        		<ul>
        		<li className="completed"><Link to="">Listing Published</Link></li>
        		<li><Link to="">1 Picture Uploaded</Link></li>
        		<li><Link to="">Upload Residential Disclosure</Link></li>
        		<li><Link to="">Upload Sellers Disclosure</Link></li>
        		<li><Link to="">Offer Accepted</Link></li>
        		<li><Link to="">Negotiation</Link></li>
        		</ul>
        	</div><div className="showing-requests panel">
        		<h2>Showing Requests</h2>
        		<p>Review and respond to interested buyers.</p>
        		<ul>
        			<li><span>Offer 1</span><Link to="" className="btn">View Offer</Link></li>
        			<li><span>Offer 2</span><Link to="" className="btn">View Offer</Link></li>
        			<li><span>Offer 3</span><Link to="" className="btn">View Offer</Link></li>
        		</ul>
        	</div>
        </div>
	</div>
    );
  }