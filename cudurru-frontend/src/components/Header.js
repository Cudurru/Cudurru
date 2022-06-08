import React from "react";
import {Navbar, Nav} from 'react-bootstrap'
import isLoggedIn from "../middleware.js";
import Autocomplete from 'react-google-autocomplete';

import Logo from "../assets/cudurru-logo-horizontal.svg";
import LogoNoText from "../assets/cudurru-logo-notext.svg";

import {Link, useHistory} from "react-router-dom";

import './Button.scss'
import './Header.scss'

class Header extends React.Component {
        render(){
        return (
        <Navbar fixed="top" className="header" expand="lg" bg="light">

            <Navbar.Brand href="/">
                <img src={Logo} className="logo-withText" alt="Cudurru - Peer to peer home buying and selling platform" />
                <img src={LogoNoText} className="logo-withoutText" alt="Cudurru - Peer to peer home buying and selling platform" />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="container-fluid justify-content-end header-nav nav-menu">
                    <Nav.Link bsPrefix="link" href="/">Home</Nav.Link>
                    <Nav.Link bsPrefix="link" href="/listings">Browse listings</Nav.Link>
                    <Nav.Link bsPrefix="link" href="/sell/get-started">Sell my property</Nav.Link>
                    <>
                    {
                        this.props.isLoggedIn ?
                            /*If we are Logged in, show Logout Link */
                            <>
                            <Nav.Link bsPrefix="link" href="/account">My listings</Nav.Link>
                            <Nav.Link bsPrefix="link" href="/logout">Sign out</Nav.Link>
                            </>
                            :
                            <>
                            <Nav.Link bsPrefix="link" href="/login">Sign in</Nav.Link>
                            <Nav.Link bsPrefix="button-secondary" href="/signup">Sign up</Nav.Link>
                            </>
                    }
                    </>
                </Nav>
            </Navbar.Collapse>
            {/* <div className="login-signup"><Link to="/signup" id="login-icon"></Link></div> */}
            {/* <div className="menu-search">
                <button id="search-icon" className="open-search"></button>
                <form id="nav-search-form" action="">
                    <Autocomplete className="search-box property-search"
                        onPlaceSelected={(place) => {
                        console.log(place);
                        }}
                        types={['address']}
                        componentRestrictions={{country: "us"}} />
                    <button id="active-search-button" className="close-search"></button>
                </form>
            </div> */}
        </Navbar>
        );
    }
}
export default Header;