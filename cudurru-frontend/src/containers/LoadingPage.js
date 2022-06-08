import React from 'react';
import LoadingImage from '../assets/loading.gif'

import './LoadingPage.scss'
export default function LoadingPage (props) {

    return(
        <div className="loading-page">
            <h2>{props.message}</h2>
            <img src={LoadingImage} alt="Loading"></img>
        </div>
    )
}