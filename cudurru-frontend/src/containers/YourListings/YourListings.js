import React, {useState, useEffect} from 'react'
import { processResponse } from "../../middleware.js";
import { API_URL } from '../../vars'
import LoadingPage from '../LoadingPage.js';
import {useWindowSize} from '../../utils/utils';
import PropertiesList from '../Listing/PropertiesList';

import "./YourListings.scss"
import { Redirect } from 'react-router';

export default function YourListings(props) {
    const [userEndPoint, setUserEndPoint] = useState(API_URL + '/api/user')
    const [userData, setUserData] = useState({propertyList: []});
    const [responseCode, setResponseCode] = useState(null);
    const [errorData, setErrorData] = useState(null);
    const windowSize = useWindowSize();

    async function getUserInfo() {
        let jwt = await localStorage.getItem('jwt');
        fetch(userEndPoint, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Authorization': 'Bearer: ' + jwt,
            },
        }).then(processResponse)
        .then(
            (res) => {
                console.log(res)
                const {statusCode, data} = res;
                setResponseCode(statusCode);
                if (statusCode === 200) {
                    setUserData(data.userData);
                }
                if (statusCode >= 400) {
                    setErrorData(res);
                }
            }
        ).catch((error) => console.log(error));
    }

    useEffect(()=>{
        getUserInfo();
    }, []) // empty array means only run once, when component mounts.

    if(props.userLoggedIn === false){
        <Redirect to="/login"/>
    }
    if(responseCode === null){
        // Return loading page is responseCode is null
        return <LoadingPage message="We are looking for your listings."/>
    }
    if(responseCode === 200){
        // In case of success, return the normal page.
        return (
            <div className="my-listings">
                <div className="my-listings-content">
                    <h1> Hello, {userData.userName}!</h1>
                    <p> Here, you will find all listings you have added, click on them to preview how potential buyers will see your listing.</p>
                    <div className="your-listings-page">
                            <PropertiesList 
                                foundPrefix="You have "
                                foundSuffix=" listed"
                                fullPropertiesList={userData.propertyList}
                                breakpoint={windowSize.breakpoint}
                                deleteButton={true}
                            />
                    </div>
                </div>
            </div>
        )
    }
    if(responseCode >= 400){
        return ""
    }

}