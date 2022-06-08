import React, {Component} from "react";
import { Link, useHistory } from "react-router-dom";
import {API_URL, ÀPI_URL} from '../../vars'
import Alert from 'react-bootstrap/Alert'

import './../../components/Input.scss'
import './../../components/Button.scss'

import './GetStarted.scss'
import './ListingPhotos.scss'

class ListingPhotos extends Component {
	sendFileData = (event) => {
		const target = event.target;
        const files = target.files;
		const name = target.name;
		// console.log(target.files);
		this.props.stageFiles(target);
		// this.props.callbackFromParent(files);
		// this.props.callbackFromParent(name);
	}
	removeFileData = (file, index) => {
		if(file.userInput){
			this.props.unstageFile(index);
		} else{
			this.props.deleteFile(index, true);
		}
	}
	reAddFile = (file, index) => {
		this.props.deleteFile(index, false)
	}
	renderStagedFiles = (imgUploads) => {
		const photoUrl = API_URL + '/static'
		let disPlayImages = imgUploads
		if (disPlayImages.length > 0){
			return (
				<React.Fragment>
					<div className="total-uploaded">{disPlayImages.length} photos</div>
					{disPlayImages.map((file, index) => {

						return(
							<div 
								className={`uploaded-photo ${file.deleted ? "deleted-photo" : ""}`} 
								key={index}
							>
								<img src={file.userInput ? URL.createObjectURL(file) : photoUrl + "/" + file.assetName } alt="Image file"></img>
								{/* <div className="input">
									<input className="text-input" type="text" value={file.description} placeholder="Type a description" onChange={(e)=>this.props.updateFileDescription(index, e.target.value)}></input>
								</div> */}
								{
									!file.deleted ?
									<button
										className="button-text"
										onClick={(e)=>this.removeFileData(file, index)}
									>
										Remove
									</button>
									:
									<>
										<div className="delete-text">This file is going to be deleted.</div>
										<button
											className="button-text"
											onClick={(e)=>this.reAddFile(file, index)}
										>
											Cancel Deletion
										</button>

									</>
								}
							</div>
						)}
					)}
				</React.Fragment>
			)
		}
		else {
			return <div className="total-uploaded">You haven't added any photos</div>
		}
	}
	render() {
		return (
			<div className="get-started-wrapper main-content">
				<div className="progress-wrapper">
					<ol className="listing-progress-bar">
    					<li className="is-complete"><span>Address</span></li>
    					<li className="is-complete"><span>Characteristics</span></li>
    					<li className="is-active"><span>Photos</span></li>
    					<li className="is-unstarted"><span>Description</span></li>
							<li className="is-unstarted"><span>Review</span></li>
					</ol>
				</div>
				{
				this.props.dataFromParent.alert ?
					<Alert variant="danger" onClose={() => this.props.closeAlert()} dismissible>
						<Alert.Heading>Image too big!</Alert.Heading>
						<p>One or more photos you chose were bigger than 25 MB.</p>
					</Alert>
					: ""
				}
				<div className="content">
					<h2>Show what's unique about your listing!</h2>
					<p>Having quality photos can make or break gaining attention and selling your house.</p>
					<div className="upload-photos">
						{this.renderStagedFiles(this.props.dataFromParent.imgUploads)}
						<div className="input">
							<input id="imgUpload" type="file" className="file-input" accept="image/*" name="imgUpload" multiple files={this.props.dataFromParent.imgUploads} onChange={this.sendFileData} />
							<label htmlFor="imgUpload" className="button-primary">Add your photos</label>
						</div>
					</div>
					<div className="nav-buttons">
						<Link to={this.props.lastLink}  className="button-text submitForm rounded last-step">Previous Step</Link>
						<Link to={this.props.nextLink}  className="button-secondary submitForm rounded next-step">Next Step</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default ListingPhotos;