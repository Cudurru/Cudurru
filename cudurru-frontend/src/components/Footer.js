import React from "react";
import Telegram from "../assets/telegram-icon.svg";
import Instagram from "../assets/instagram-icon.svg";
import Facebook from "../assets/facebook-icon.svg";
import Twitter from "../assets/twitter-icon.svg";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

import "./Footer.scss"
class Footer extends React.Component {
    render() {
        return (
            <div className="footer-inner">
                <div className='copyright'>Copyright &copy; 2020 Cudurru, LLC.</div>
                <div className="social-media">
                    <a href="https://t.me/cudurru_team" target="_blank"><img src={Telegram} alt="Join the conversation in the Cudurru Telegram channel." /></a>
                    <a href="https://instagram.com/cudurru/" target="_blank"><img src={Instagram} alt="Follow Cudurru on Instagram." /></a>
                    <a href="https://facebook.com/cudurru/" target="_blank"><img src={Facebook} alt="Like Cudurru on Facebook." /></a>
                    <a href="https://twitter.com/cudurru" target="_blank"><img src={Twitter} alt="Follow Cudurru on Twitter." /></a>
                </div>
                <div className="links">
                    <Link className="link" to={"/"}>Privacy Policy</Link>
                    <Link className="link" to={"/"}>Terms & Conditions</Link>
                    <a className="link link-email" href="mailto:info@cudurru.io">info@cudurru.io</a>
                </div>
            </div>
        );
    }
}

export default Footer;