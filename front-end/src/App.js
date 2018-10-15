import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import logo from './udaan.png';
import './App.css';



class App extends Component {
	constructor(props){
		super(props);
		
	}

	responseGoogle = (response) => {
		console.log(response);
	};

	responseFacebook = (response) => {
		console.log(response);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Udaan Hiring Challenge: Movie ticket booking App
					</p>

					<GoogleLogin
						clientId="738527970327-sk20cp7u9es6funfpni45isk28723o9v.apps.googleusercontent.com"
						buttonText="Login with Google"
						onSuccess={this.responseGoogle}
						onFailure={this.responseGoogle}
						className="google-button"
					/>

					<FacebookLogin
						appId="521997934935685"
						autoLoad={true}
						fields="name,email,picture"
						callback={this.responseFacebook}
						cssClass="my-facebook-button-class"

					/>
				</header>
			</div>
		);
	}
}

export default App;
