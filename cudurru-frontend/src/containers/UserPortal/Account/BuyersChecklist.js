import React, {Component} from "react";
import { Link } from "react-router-dom";

export default function BuyersChecklist() {

    return (
        <div className="buyers-checklist panel">
            <h2>Buyer's Checklist</h2>
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
        </div>
    );
}