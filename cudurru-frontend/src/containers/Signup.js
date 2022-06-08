import React from "react";
import  authedFetch, { processResponse, validateJWT  } from '../middleware.js';
import SimpleReactValidator from 'simple-react-validator';
import { BrowserRouter as Router , Route, Link, useHistory, Redirect } from 'react-router-dom';
import SignupSuccess from './SignupSuccess';
import { API_URL } from '../vars.js';

import '../components/Button.scss';
import '../components/Input.scss';
import './Signup.scss';

class SignupPage extends React.Component{

    constructor(props) {
        super(props);
        this.signupEndpoint = API_URL + "/api/register";
        this.validator = new SimpleReactValidator({
            validators: {
                match: {
                    message: 'Passwords must match',
                    rule: (val, params, validator) => {
                        // console.log(params);
                        // console.log(val);
                        return params.includes(val);
                    }
                } 
            },
            messages: {                
                // default: "Something went wrong."
            },
        });
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            [name]: value,
            }), () => { console.log(this.state) }
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
        if (this.validator.allValid()) {
            // call the api
            this._submit(this.state);
        } else {
        this.validator.showMessages();
        // rerender to show messages for the first time
        // you can use the autoForceUpdate option to do this automatically`
        this.forceUpdate();
        }
    }

    _submit = (request) => {
        fetch(this.signupEndpoint, {
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
                console.log(res);
                if (statusCode == 401 ) {
                    // console.log("received 401");
                    return null;
                }
                if (statusCode == 400 ) {
                    // console.log("received 400");
                    return null;
                }
                if (statusCode == 201 ) {
                    this.setState(() => ({
                     toSuccess: true
                    }));
                    // console.log("received 201");
                }
            })
            .catch((error) => {
                console.warn('error');
                console.warn(error);
            });
    }

    onCancel = () => {
        this.clearState();
        // reset form
    }

    clearState = () => {
        // console.log('clearing state');
        this.setState({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    render() {
        if (this.state.toSuccess === true) {

            return (
                <div>
                <Route path="/signup/signup-success">
                    <SignupSuccess />
                </Route>
                <Redirect to='/signup/signup-success' />
                </div>
                )
        }
        let userNameErrorMessage = this.validator.message('username', this.state.username, 'required|alpha_space', { className: 'error-text', messages:{alpha_space: "Legal name must be only letters or spaces."} });
        let emailErrorMessage = this.validator.message('email', this.state.email, 'required|email', { className: 'error-text' })
        let passwordErrorMessage = this.validator.message('password', this.state.password, 'required|min:8', { className: 'error-text' })
        let confirmPasswordErrorMessage = this.validator.message('confirmPassword', this.state.confirmPassword, 'required|match:'+this.state.password, { className: 'error-text' })
        return (
        <div className="signup main-content">
            <div className="signup-wrapper">
                <h2>Signup</h2>
                <div className="input">
                    <label className="input-label legal-name name text-field">Legal name:<br/>
                        <input
                            className={`text-input ${ userNameErrorMessage ? "input-with-error" : ""}`}
                            type="text"
                            id="username"
                            name="username"
                            onBlur={() => {this.validator.showMessageFor('username'); this.setState({check: true})}}
                            value={this.props.value}
                            maxLength="99"
                            onChange={this.handleInputChange}
                            placeholder="Jane Doe"
                            required
                        />
                            {userNameErrorMessage}
                    </label>
                </div>
                <div className="input">
                    <label className="label-input email text-field">Email:<br/>
                        <input
                            className={`text-input ${emailErrorMessage ? "input-with-error" : ""}`}
                            type="email"
                            id="email"
                            value={this.props.value}
                            name="email"
                            onBlur={() => {this.validator.showMessageFor('email'); this.setState({check: true})}}
                            onChange={this.handleInputChange}
                            maxLength="99"
                            placeholder="example@email.com"
                            required
                        />
                        {emailErrorMessage}
                    </label>
                </div>
                <div className="input">
                    <label className="input-label password text-field">Password:<br/>
                        <input
                            className={`text-input ${passwordErrorMessage ? "input-with-error" : ""}`}
                            type="password"
                            id="password"
                            value={this.props.value}
                            name="password"
                            onBlur={() => {this.validator.showMessageFor('password'); this.setState({check: true})}}
                            onChange={this.handleInputChange}
                            maxLength="99"
                            required
                        />
                        {passwordErrorMessage}
                    </label>
                </div>
                <div className="input">
                    <label className="input-label password text-field">Confirm password:<br/>
                        <input
                            className={`text-input ${confirmPasswordErrorMessage ? "input-with-error" : ""}`}
                            type="password"
                            id="confirm-password"
                            value={this.props.value}
                            name="confirmPassword"
                            onBlur={() => {this.validator.showMessageFor('confirmPassword'); this.setState({check: true})}}
                            onChange={this.handleInputChange}
                            maxLength="99"
                            required
                        />
                        {confirmPasswordErrorMessage}
                    </label>
                </div>
                <div className="action-buttons">
                    <button
                        type="reset"
                        className="button-text cancel rounded"
                        onClick={this.onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="button-primary submit rounded"
                        onClick={this.onSubmit}
                    >
                        Submit
                    </button>
                </div>
            <p>Already have an account? <Link className="inline-link" to="/login">Login here.</Link></p>
            </div>
        </div>
    );
    }
}

export default SignupPage;
