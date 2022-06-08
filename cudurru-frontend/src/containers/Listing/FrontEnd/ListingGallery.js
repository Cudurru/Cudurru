import React, {Component} from "react";
import {  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams} from "react-router-dom";

import ListingSingleGrid from "./ListingSingleGrid";
import ListingSingle from "./ListingSingle";
import NewsletterSignup from "../../../components/NewsletterBox";
import SearchFilter from "../../../components/SearchFilter";

import imgSrc from "../../../assets/homes/sample1.jpg";
import imgSrc2 from "../../../assets/homes/sample2.png";
import imgSrc3 from "../../../assets/homes/sample3.jpg";
import imgSrc4 from "../../../assets/homes/sample4.jpg";
import imgSrc5 from "../../../assets/homes/sample5.jpg";
import imgSrc6 from "../../../assets/homes/sample6.jpg";

class ListingGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homes: [
                {id: 1, streetAddress: '481 S. Park St.', streetAddress2: 'Apt 2', city:'Detroit', state:'MI', zip:'48215',beds: 4, baths: 2, sqft: 1200, src: imgSrc, src2: imgSrc2, src3: imgSrc3, src4: imgSrc4, src5: imgSrc5, price:'200,000'},
                {id: 2, streetAddress: '1417 Clairmount Ave.', streetAddress2: null, city:'Detroit', state:'MI', zip:'48206', beds: 3, baths: 1.5, sqft: 1000, src: imgSrc2, src2: imgSrc, src3: imgSrc3, src4: imgSrc4, src5: imgSrc5, price: '174,000'},
                {id: 3, streetAddress: '1 Atkinson St.', streetAddress2: null, city:'Detroit', state:'MI', zip:'', beds: 2, baths: 1, sqft: 860, src: imgSrc3, src2: imgSrc2, src3: imgSrc, src4: imgSrc4, src5: imgSrc5, price: '90,000'},
                {id: 4, streetAddress: '561 New Town St.', streetAddress2: null, city:'Detroit', state:'MI', zip:'48215', beds: 6, baths: 4, sqft: 2800, src: imgSrc4, src2: imgSrc2, src3: imgSrc, src4: imgSrc4, src5: imgSrc5, price: '499,000'},
                {id: 5, streetAddress: '1549 Clark Ave.', streetAddress2: null, city:'Detroit', state:'MI', zip:'48209', beds: 4, baths: 2.5, sqft: 1600, src: imgSrc5, src2: imgSrc2, src3: imgSrc, src4: imgSrc4, src5: imgSrc5, price: '325,000'},
                {id: 6, streetAddress: '430 E. Ferry St.', streetAddress2: null, city:'Detroit', state:'MI', zip:'48202', beds: 3, baths: 1, sqft: 1100, src: imgSrc6, src2: imgSrc2, src3: imgSrc, src4: imgSrc4, src5: imgSrc5, price: '133,000'},
            ]
        }
    }

    render() {
    return (
            	<div className="listings main-content">
            	<Switch>
    				<Route exact path="/listings">
    				<SearchFilter />
					<div className="listings-gallery">	
    					{this.state.homes.map((home, key) =>
    					<ListingSingleGrid home={home} key={home.id} />)}
    				</div>
    				</Route>
    				<Route path={"/listings/:id"}>
                        <ListingSingle homes={this.state.homes} />
    				</Route>
        		</Switch> 
    				<NewsletterSignup />
				</div>
    	);
	}
}

export default ListingGallery;