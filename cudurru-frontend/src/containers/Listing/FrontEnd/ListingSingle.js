import React, {Component} from "react";
import {  BrowserRouter as Router,
  Switch,
  Route,
  Link, withRouter} from "react-router-dom";
import Slider from "react-slick";

import bedIcon from "../../../assets/bed-icon.png";
import bathIcon from "../../../assets/bath-icon.png";
import sqftIcon from "../../../assets/sqft-icon.png";

class ListingSingle extends Component {
    constructor(props) {
        super(props);
      }

    componentDidMount = () => {
        const id = this.props.match.params.id;

    }

    fetchData = id => {
    
    }



    render() {
            var settings = {
                dots: true,
                autoPlay: false,
            };

            return (
                <div className="listing-wrapper">
                    {this.props.homes.filter(home => home.id == this.props.match.params.id).map(activeHome => ( 
                        <div className="single-listing">
                        <Slider {...settings}>
                        <div>
                            <img src={activeHome.src} alt="" />
                        </div>
                        <div>
                            <img src={activeHome.src2} alt="" />
                        </div>
                        <div>
                            <img src={activeHome.src3} alt="" />
                        </div>
                        <div>
                            <img src={activeHome.src4} alt="" />
                        </div>
                        <div>
                            <img src={activeHome.src5} alt="" />
                        </div>
                    </Slider>
                        <div className="listing-title">
                            <div className="home-address">
                                <h2>{activeHome.streetAddress} </h2>
                                <span>{activeHome.city}, {activeHome.state} {activeHome.zip}</span>
                            </div>
                            <div className="favorite-home"></div>
                        </div>
                        <div className="attributes"><img src={bedIcon} alt="Bed Icon" className="icon" /><span className="label">{activeHome.beds} Beds</span><img src={bathIcon} alt="Bath Icon" className="icon" /><span className="label">{activeHome.baths} Baths</span><img src={sqftIcon} alt="Square foot icon" className="icon" /><span className="label">{activeHome.sqft} Sq ft</span></div>
                        <div className="intro-text"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod quam vestibulum est auctor mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc vitae tempus odio, scelerisque commodo ante. Etiam eget felis vitae purus lobortis pharetra finibus quis diam. Phasellus enim quam, volutpat vitae molestie vitae, interdum quis tortor. Integer consequat vehicula nunc. Cras scelerisque laoreet imperdiet. Sed maximus mi eget luctus facilisis. Aenean id erat eget ex accumsan tincidunt quis et quam. Quisque lobortis sapien at erat bibendum posuere.</p></div>
                        <div className="asking-price">
                            <div className="content">
                                <span className="text">Asking price</span>
                                <br />
                                <span className="price">${activeHome.price}</span></div>
                            </div>
                            <Link to="/" className="listing-cta message">Send Message</Link>
                            <Link to="/" className="listing-cta showing">Schedule Visit</Link>
                            <Link to="/" className="listing-cta make-offer">Make Offer</Link>
                        
                        <div className="long-description"><h3>Headline</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod quam vestibulum est auctor mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc vitae tempus odio, scelerisque commodo ante. Etiam eget felis vitae purus lobortis pharetra finibus quis diam. Phasellus enim quam, volutpat vitae molestie vitae, interdum quis tortor. Integer consequat vehicula nunc. Cras scelerisque laoreet imperdiet. Sed maximus mi eget luctus facilisis. Aenean id erat eget ex accumsan tincidunt quis et quam. Quisque lobortis sapien at erat bibendum posuere.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod quam vestibulum est auctor mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc vitae tempus odio, scelerisque commodo ante. Etiam eget felis vitae purus lobortis pharetra finibus quis diam. Phasellus enim quam, volutpat vitae molestie vitae, interdum quis tortor. Integer consequat vehicula nunc. Cras scelerisque laoreet imperdiet. Sed maximus mi eget luctus facilisis. Aenean id erat eget ex accumsan tincidunt quis et quam. Quisque lobortis sapien at erat bibendum posuere.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod quam vestibulum est auctor mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc vitae tempus odio, scelerisque commodo ante. Etiam eget felis vitae purus lobortis pharetra finibus quis diam. Phasellus enim quam, volutpat vitae molestie vitae, interdum quis tortor. Integer consequat vehicula nunc. Cras scelerisque laoreet imperdiet. Sed maximus mi eget luctus facilisis. Aenean id erat eget ex accumsan tincidunt quis et quam. Quisque lobortis sapien at erat bibendum posuere.</p></div>
                        <div className="map-view">
                            <iframe width="100%" height="600" frameborder="0" src={'https://www.google.com/maps/embed/v1/place?key=AIzaSyDGMTjMzdvc6DdVGx7ckfgzvpftnt4CFr8&q=' + activeHome.streetAddress + activeHome.streetAddress2 + activeHome.city + activeHome.state + activeHome.zip} allowfullscreen>
</iframe></div> 
    </div>
                    ))}
                </div>
            );
        }
    }

export default withRouter(ListingSingle);