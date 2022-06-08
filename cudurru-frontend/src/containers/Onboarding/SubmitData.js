import React, {useState, useEffect} from "react";
import { processResponse, validateJWT } from "../../middleware.js";
import { API_URL } from '../../vars.js';
import {humanFileSize} from '../../utils/utils.js';
import { Link } from "react-router-dom";
import LoadingPage from '../LoadingPage'

import './SubmitData.scss'

export default function SubmitData(props){
    const [propertiesEndpoint, setPropertyEndpoint] = useState(API_URL + "/api/properties");
    const [propertyAssetsEndpoint, setPropertyAssetsEndpoint] = useState(API_URL + '/api/propertyAssets');
    const [propertyAssetEndpoint, setPropertyAssetEndpoint] = useState(API_URL + '/api/propertyAsset');
    const [createPropertyState, setCreatePropertyState] = useState('creating');
    const [propertyId, setPropertyId] = useState(null);

    async function updatePropertyAsset(propertyAssetId, index){
        let jwt = await localStorage.getItem('jwt');
        let description = props.dataFromParent.imgUploads[index].description
        // If description was not set, don't post anything.
        if(description){
            fetch(propertyAssetEndpoint + '/' + propertyAssetId, {
                method: 'PUT',
                body: JSON.stringify({
                        description: description,
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer: ' + jwt,
                },
            }).then(processResponse)
            .then(
                res => {
                    const {statusCode, data} = res;
                    console.log(res);
                    if(!created){
                        props.updateFileUploadState(index, 'updated');
                    }
                }                
            ).catch((error) => {
                console.log(error);
            })    
        }
        
    }

    async function CreatePropertyAsset(propertyId, fileObj, index){
        let jwt = await localStorage.getItem('jwt');
        let data = new FormData();
        // updateFileUploadState(index, state){
        props.updateFileUploadState(index, 'uploading');
        data.append('file_obj', fileObj);
        await fetch(propertyAssetsEndpoint + '/' + propertyId, {
            method: 'POST',headers: {
                Accept: 'application/json',
                'Authorization': 'Bearer: ' + jwt,
            },
            body: data,
        }).then(processResponse)
        .then(
            res => {
                const { statusCode, data} = res;
                console.log(res);
                if (statusCode === 201) {
                    console.log(fileObj.name + " uploaded successfully.")
                    
                    props.updateFileUploadState(index, 'finished');
                    updatePropertyAsset(data.propertyAssetId, index);

                }
                else {
                    props.updateFileUploadState(index, 'failed');
                }
            }
        ).catch((error) => {
            console.log(error);
            props.updateFileUploadState(index, 'failed');
        })
    }
    async function CreateProperty(){

        let jwt = await localStorage.getItem('jwt');
        // console.log(props.dataFromParent)
        let bodyObj = {...props.dataFromParent}
        
        for(var [key, value] of Object.entries(bodyObj)){
            if(key === "imgUploads" || value === "")
            {
                delete bodyObj[key];
            }
        }
        
        fetch(propertiesEndpoint, {
            method: 'POST',
            body: JSON.stringify({
                    ...bodyObj
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer: ' + jwt,
            },
        }).then(processResponse)
        .then(
            async res => {
                const { statusCode, data} = res;
                console.log(res);
                if (statusCode === 201) {
                    setCreatePropertyState('property-created');
                    // CreatePropertyAsset signature
                    // CreatePropertyAsset(propertyId, fileObj, index)
                    let propertyId = data.propertyId
                    setPropertyId(propertyId);
                    for(let index=0; index < props.dataFromParent.imgUploads.length;index++){
                        let fileObj = props.dataFromParent.imgUploads[index];
                        await CreatePropertyAsset(propertyId, fileObj, index);
                    }
                }
                else {
                    setCreatePropertyState('failed');
                }
            }
        ).catch((error) => {
            console.log(error);
            setCreatePropertyState('failed');
        })
    }
    useEffect(() => {
        CreateProperty();
    }, []);

    let uploadFinished = true;
    props.dataFromParent.imgUploads.map((file, index) => {
        uploadFinished = (file.uploadState === "finished") || (file.uploadState === "updated") || (file.uploadState === "failed") ? uploadFinished && true : false
    })
    if(uploadFinished && (createPropertyState === "property-created")){
        setCreatePropertyState('created');
        console.log('uploadFinished');
    }
    let propertyAssetsWithErrors = props.dataFromParent.imgUploads.filter((file) => {
        return (file.uploadState === "failed")
    })

    if ((createPropertyState === 'creating') || (createPropertyState === "property-created")){
        return <LoadingPage message="We are creating your listing."/>
    }

    if (createPropertyState === 'failed') {
        return (
            <div className="submit-data">
                <div className="content">
                    <p className="headline">Sorry, we couldn't create your listing right now.</p>
                    <p className="subtitle">Make sure you're internet connection is working and try again.</p>
                    <Link className="button-primary action" to="/sell/get-started/review-listing">Go back to review listing</Link>
                </div>
            </div>)
    } else {
        return (
            <div className="submit-data">
                <div className="content">
                    <p className="headline">Your listing has been successfully created.</p>
                    { propertyAssetsWithErrors.length > 0 ?
                        <p className="subtitle">However, the following photos couldn't be updated</p> : "" }
                        {propertyAssetsWithErrors.map((file, index) =>{
                            if(file.userInput){
                                return (
                                    <div key={index}>
                                        {file.name} | {humanFileSize(file.size, true) } | {file.uploadState}
                                    </div>
                                )
                            }    
                            else{
                                return (
                                    <div key={index}> 
                                        {file.assetName} | {file.uploadState}
                                    </div>
                                )
                            }
                        })}
                    <Link className="button-primary action" to={"/property/" + propertyId}>Check out your listing!</Link>
                </div>
            </div>)
    }

}