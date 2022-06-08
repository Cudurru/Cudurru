import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {processResponse} from '../../middleware';
import {API_URL} from '../../vars';
import {humanFileSize} from '../../utils/utils'
import LoadingPage from '../LoadingPage';

export default function UpdateData(props) {
    const [propertyEndpoint, setPropertyEndpoint] = useState(API_URL + "/api/property");
    const [propertyAssetsEndpoint, setPropertyAssetsEndpoint] = useState(API_URL + '/api/propertyAssets');
    const [propertyAssetEndpoint, setPropertyAssetEndpoint] = useState(API_URL + '/api/propertyAsset');
    const [createPropertyState, setCreatePropertyState] = useState('updating');
    const {id, page} = useParams();

    async function deletePropertyAsset(propertyAssetId, index){
        let jwt = await localStorage.getItem('jwt');
        // If description was not set, don't post anything.
    
        fetch(propertyAssetEndpoint + '/' + propertyAssetId, {
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
                props.updateFileUploadState(index, "deleted");
            }                
        ).catch((error) => {
            console.log(error);
        })
        
    }

    async function updatePropertyAsset(propertyAssetId, index, created=true){
        let jwt = await localStorage.getItem('jwt');
        let description = props.dataFromParent.imgUploads[index].description
        // If description was not set, don't post anything.
        
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
            body: data
        }).then(processResponse)
        .then(
            res => {
                const { statusCode, data} = res;
                console.log(res);
                if (statusCode === 201) {
                    console.log(fileObj.name + " uploaded successfully.")
                    props.updateFileUploadState(index, 'created');
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

    async function UpdateProperty() {
        let jwt = await localStorage.getItem('jwt');

        let bodyObj = {...props.dataFromParent}
        
        for(var [key, value] of Object.entries(bodyObj)){
            if(key === "imgUploads" || value === "")
            {
                bodyObj[key] = null
            }
        }

        fetch(propertyEndpoint + '/' + id, {
            method: 'PUT',
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
                if (statusCode === 200) {
                    // CreatePropertyAsset signature
                    // CreatePropertyAsset(propertyId, fileObj, index)
                    let propertyId = data.propertyId
                    setCreatePropertyState('property-updated');

                    for(let index=0; index<props.dataFromParent.imgUploads.length; index++){
                        let fileObj = props.dataFromParent.imgUploads[index];
                        if(fileObj.userInput){
                            await CreatePropertyAsset(propertyId, fileObj, index);
                        }
                        else {
                            let propertyAssetId = fileObj.assetName.split('.')[0];
                            if(fileObj.deleted){
                                deletePropertyAsset(propertyAssetId, index)
                            }
                            else{
                                updatePropertyAsset(propertyAssetId, index, false);
                            }
                        }                            
                    }
                    
                }
                else {
                    setCreatePropertyState('failed');
                }
            }
        ).catch((error) => {
            setCreatePropertyState('failed');
            console.log(error);
        })
    }
    useEffect(()=>{
        UpdateProperty();
    }, []);
    let uploadFinished = true;
    props.dataFromParent.imgUploads.map((file, index) => {
        uploadFinished = (file.uploadState === "created") || (file.uploadState === "updated") || (file.uploadState === "failed") || (file.uploadState === "deleted") ? uploadFinished && true : false
    })
    if(uploadFinished && (createPropertyState === "property-updated")){
        setCreatePropertyState('updated');
        // console.log('uploadFinished');
    }
    // console.log("oi");
    let propertyAssetsWithErrors = props.dataFromParent.imgUploads.filter((file) => {
        return (file.uploadState === "failed")
    })
    if ((createPropertyState === 'updating') || (createPropertyState === "property-updated")){
        return <LoadingPage message="We are updating your listing."/>
    }

    if (createPropertyState === 'failed') {
    // if(true){
        return (
            <div className="submit-data">
                <div className="content">
                    <p className="headline">Sorry, we couldn't update your listing right now.</p>
                    <p className="subtitle">Make sure your internet connection is working and try again.</p>
                    <Link className="button-primary action" to={props.links.review}>Go back to review listing</Link>
                </div>
            </div>)
    } else {
        return (
            <div className="submit-data">
                <div className="content">
                    <p className="headline">Your listing has been updated successfully.</p>
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
                        <Link class="button-primary" to={"/property/" + id}>Check out your listing!</Link>
                </div>
            </div>)
    }
}