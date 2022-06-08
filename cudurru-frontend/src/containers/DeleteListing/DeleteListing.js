import React, {useState, useEffect} from "react";
import { processResponse, validateJWT } from "../../middleware.js";
import { API_URL } from '../../vars.js';
import { Link, Redirect, useParams } from "react-router-dom";
import LoadingPage from '../LoadingPage'

import '../../components/Button.scss'
import './DeleteListing.scss'

export default function DeleteListing(props) {
    const [isOwner, setIsOwner] = useState(null);
    const {id} = useParams();
    const propertyEndpoint = API_URL + '/api/property';
    const [deletePropertyState, setDeletePropertyState] = useState(null);
    const [serverData, setServerData] = useState(null);
    async function getServerData(){
        fetch(propertyEndpoint + '/' + id , {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then(processResponse)
        .then(
            res => {
                const {statusCode, data} = res;
                console.log(res);
                if(statusCode === 200){
                    setServerData(data.propertyData);
                    setDeletePropertyState('waiting-for-input');
                }
                else{
                    setDeletePropertyState('failed');
                }
            }
        ).catch((error) => {
            console.log(error);
            setDeletePropertyState('failed');
        })        
    }
    async function checkForPermission (){
        let jwt = await localStorage.getItem('jwt');
        fetch(propertyEndpoint + '/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                shashwmelsowje: "banana"
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer: ' + jwt,
            },
        }).then(processResponse)
        .then(
            (res) => {
                console.log(res)
                const {statusCode, data} = res;
                if (statusCode === 200) {
                    setIsOwner(true);
                    return
                }
                if(statusCode === 403){
                    setIsOwner(false)
                }
            }
        ).catch((error) => console.log(error));
    }
    async function deleteProperty(){
        let jwt = await localStorage.getItem('jwt');
        // If description was not set, don't post anything.
        setDeletePropertyState('deleting');
    
        fetch(propertyEndpoint + '/' + id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Authorization': 'Bearer: ' + jwt,
            },
        }).then(processResponse)
        .then(
            res => {
                const {statusCode, data} = res;
                console.log(res);
                if(statusCode === 200){
                    setDeletePropertyState('deleted');
                    return
                }
                else{
                    setDeletePropertyState('failed');
                }
            }                
        ).catch((error) => {
            setDeletePropertyState('failed');
            console.log(error);
        })
        
    }
    useEffect(()=>{
        checkForPermission();
        getServerData();
    }, [])
    // console.log(isOwner)
    if(props.isLoggedIn === false){
        return(
            <Redirect to="/login"/>
        )
    }
    if(isOwner === null){
        return(
            <LoadingPage message="Preparing to delete your listing..."></LoadingPage>
        )
    }
    if(isOwner === false){
        return(
            <Redirect to="/account"/>
        )
    }
    // console.log(deletePropertyState)
    if(isOwner === true){
        if(!deletePropertyState){
            return (
                <LoadingPage message="Loading the listing data...."/>
            )
        }
        if(deletePropertyState === 'waiting-for-input'){
            return(
                <div className="delete-listing">
                    <div className="content">
                        <h3 className="headline">Delete this property</h3>
                        <p className="delete-message">Are you sure you want to delete your listing from <span>{serverData.address1 + ", " + serverData.address2 }</span>? </p>
                        <div className="button-actions">
                            <Link className="button-text" to='/account'>No, thanks</Link>
                            <button className="button-delete" onClick={()=>deleteProperty()}>Delete property</button>
                        </div>
                    </div>
                </div>
            )
        }
        if(deletePropertyState === 'failed'){
            return(
                <div className="delete-listing">
                    <div className="content">
                        <p className="headline">Sorry, we couldn't delete your listing</p>
                        <p className="subtitle">Make sure your internet connection is working and try again.</p>
                        <div className="button-actions">
                            <Link className="button-primary action" to='/account'>Go back to my listings</Link>
                        </div>
                    </div>
                </div>
            )
        }
        if(deletePropertyState === 'deleting'){
            return(
                <LoadingPage message="Deleting your listing..."/>
            )
        }
        if(deletePropertyState === 'deleted'){
            return(
                <div className="delete-listing">
                    <div className="content">
                        <p className="headline">Your listing has been successfully deleted.</p>
                        <div className="button-actions">
                            <Link className="button-primary action" to='/account'>Go back to my listings</Link>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
