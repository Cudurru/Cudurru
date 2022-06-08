import React from "react";
import  authedFetch, { processResponse, validateJWT, isLoggedIn } from '../middleware.js';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { API_URL } from '../vars.js';

import '../components/Input.scss';
import '../components/Button.scss';

import './Login.scss';

class LoginPage extends React.Component{

    constructor(props) {
        super(props);
        this.loginEndpoint = API_URL + "/api/login";
        this.validator = new SimpleReactValidator();
        this.state = {
            email: '',
            password: '',
        };
    }


    componentDidMount() {
       /* When the component mounts, make sure we are not LoggedIn */
       this.props.checkIfLoggedIn();
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            [name]: value,
            }), () => { /*console.log(this.state)*/ }
        );
    }


    disableButton = () => {
        this.setState({ canSubmit: false });
    }

    enableButton = () => {
        this.setState({ canSubmit: true });
    }

    onSubmit = () => {
        // console.log('submitting');
        // console.log(this.state);
        //this._submit(this.state);
        this.validator.showMessages();
        this._submit(this.state);
    }
    onCancel = () => {
        this.clearState();
        // reset form
    }

    clearState = () => {
        // console.log('clearing state');
        this.setState({
            email: '',
            password: '',
        });
    }

    _submit(request) {
        fetch(this.loginEndpoint, {
            method: 'POST',
            body: JSON.stringify( request ),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(processResponse)
            .then(async(res) => {
                const { statusCode, data} = res;
                if (statusCode == 401 ) {
                    // console.log("received 401");
                }
                if (statusCode == 400 ) {
                    // console.log("received 400");
                }
                if (statusCode == 200 ) {
                    // this.setState(() => ({
                    //  toHome: true
                    // }));
                    /* Make sure the App component updates it's isLoggedIn state*/
                    this.props.checkIfLoggedIn();
                    // console.log("received 200");
                    this.setState({wrongPassword: false});
                }
                else {
                    this.setState({wrongPassword: true});
                }
            })
            .catch((error) => {
                // console.warn('error');
                console.warn(error);
            });
    }

    render() {
        if (this.state.toHome === true) {

            return <Redirect to='/' />
        }

        /*If we are already Logged In, return to home */
        // console.log(this.props.isLoggedIn)
        if (this.props.isLoggedIn === true) {
           return <Redirect to='/' />
        }
        let passwordWrongError = this.state.wrongPassword ? <div className="error-text">Either the email or the password are incorrect.</div> : "";
        let passwordErrorMessage = this.validator.message('password', this.state.password, 'required', { className: 'error-text' })
        let emailErrorMessage = this.validator.message('email', this.state.email, 'required|email', { className: 'error-text' })
        return (
        <div className="login main-content">
            <div className="login-wrapper">
                <h2 className="login-title">Login</h2>
                <div className="input">
                    <label className="input-label name text-field">Email:<br/>
                    <input
                        className={`text-input ${ emailErrorMessage || passwordWrongError ? "input-with-error" : ""}`}
                        type="text"
                        id="email"
                        name="email"
                        value={this.state.email}
                        maxLength="99"
                        onBlur={()=>{this.validator.showMessageFor('email'); this.setState({check: true})}}
                        onChange={this.handleInputChange}
                        required
                    />
                    {emailErrorMessage}
                </label>
                </div>
                <div className="input">
                        <label className="input-label password name text-field">Password:<br/>
                            <input
                                className={`text-input ${passwordErrorMessage || passwordWrongError ? "input-with-error" : ""}`}
                                type="password"
                                id="password"
                                name="password"
                                value={this.state.password}
                                maxLength="99"
                                onBlur={()=>{this.validator.showMessageFor('password'); this.setState({check: true})}}
                                onChange={this.handleInputChange}
                                required
                            />
                            {passwordErrorMessage || passwordWrongError}
                        </label>
                    </div>
                <div className="action-buttons">
                        <button
                            type="reset"
                            className="button-text cancel rounded"
                            onClick={() => this.onCancel()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="button-primary submit rounded"
                            onClick={() => this.onSubmit()}
                        >
                            Submit
                        </button>
                    </div>
                <p>Don't have an account? <Link className="inline-link" to="/signup">Signup now</Link></p>
            </div>
        </div>
    );
    }
}

export default LoginPage;
