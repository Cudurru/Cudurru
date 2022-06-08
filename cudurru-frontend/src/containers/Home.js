import React from "react";
import { Link, useHistory } from "react-router-dom";
import Autocomplete from 'react-google-autocomplete';
import  authedFetch, { processResponse, validateJWT, isLoggedIn } from '../middleware.js';

import IntroPic from "../assets/real-state-hands.svg";

import "./Home.scss"
import "../components/Input.scss"
import "../components/Button.scss"

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }


    // sendLoginStatus = (response) => {
    //     if (this.state.isLoggedIn === true){
    //         this.props.parentCallback("true");
    //     } else {
    //         this.props.parentCallback("false");
    //     }
    // }

    // componentDidMount() {
    //     const jwtExists = isLoggedIn();
    //     if (!jwtExists) {
    //         this.setState({
    //             isLoggedIn: true
    //         });
    //     }
    //     return this.sendLoginStatus();
    // }

    render() {
    document.body.classList.add("home");
    return (
        <div className="main-home">
            <div className="content">
                <h1 className="headline">Selling &amp; buying real estate, simplified
                    <span className="headline-yellow">.</span>
                </h1>
                <h2 className="headline-subtitle">
                    All the power of real estate in your hands.
                </h2>
                <div className="action-buttons">
                    <Link className="button-secondary" to={"/listings"}>Browse listings</Link>
                    <Link className="button-primary" to={"/sell/get-started"}>Sell my property</Link>
                </div>
            </div>
            <div className="image">
                <img src={IntroPic}></img>
            </div>

        </div>
    );
  }
}

export default Home;