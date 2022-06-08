import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Route,
  Link, 
  useParams,
  useRouteMatch
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./containers/Home";
// import ListingGallery from "./containers/Listing/FrontEnd/ListingGallery";
import BrowseHomes from "./containers/Listing/BrowseHomes";
import Sell from "./containers/Sell";
import ContactPage from "./containers/Contact";
import LoginPage from "./containers/Login";
import PropertyDetailed from "./containers/PropertyDetailed";
import LogoutPage from "./containers/Logout";
import SignupPage from "./containers/Signup";
import GetStarted from "./containers/Onboarding/GetStarted";
import UserPortal from "./containers/UserPortal/Portal";
import EditListing from "./containers/EditListing/EditListing.js"
import YourListings from "./containers/YourListings/YourListings";
import DeleteListing from "./containers/DeleteListing/DeleteListing";

import {isLoggedIn} from "./middleware"

import "./App.scss"

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: null
        }
    }

    checkIfLoggedIn = () => {
        isLoggedIn().then(res => {
            this.setState({
                isLoggedIn: res,
            });
            // console.log(this.state.isLoggedIn)
        })
        
    }
    componentDidMount() {
        this.checkIfLoggedIn();
    }

    render() {
        return (
            <div className="root-inner">
                <header><Header isLoggedIn={this.state.isLoggedIn} /></header>
                    <Route exact path="/">
                        <Home checkIfLoggedIn={this.checkIfLoggedIn} 
                                isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/listings">
                        {/* <ListingGallery checkIfLoggedIn={this.checkIfLoggedIn} 
                                        isLoggedIn={this.state.isLoggedIn}
                        /> */}
                        <BrowseHomes/>
                    </Route>
                    <Route path="/sell/get-started">
                        <GetStarted checkIfLoggedIn={this.checkIfLoggedIn} 
                                    isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/logout">
                        <LogoutPage checkIfLoggedIn={this.checkIfLoggedIn}
                                    isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/contact">
                        <ContactPage checkIfLoggedIn={this.checkIfLoggedIn} 
                                        isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/login">
                        <LoginPage checkIfLoggedIn={this.checkIfLoggedIn} 
                                    isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/signup">
                        <SignupPage checkIfLoggedIn={this.checkIfLoggedIn} 
                                    isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/property/:id">
                        <PropertyDetailed   checkIfLoggedIn={this.checkIfLoggedIn} 
                                            isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/edit/:page/:id">
                        <EditListing
                            checkIfLoggedIn={this.checkIfLoggedIn}
                            isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/delete-listing/:id">
                        <DeleteListing
                            isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                    <Route path="/account">
                        <YourListings
                            checkIfLoggedIn={this.checkIfLoggedIn}
                            isLoggedIn={this.state.isLoggedIn}
                        />
                    </Route>
                <footer><Footer sendLoginStatus={this.state.isLoggedIn} /></footer>
            </div>
        );
    }
}

export default App;