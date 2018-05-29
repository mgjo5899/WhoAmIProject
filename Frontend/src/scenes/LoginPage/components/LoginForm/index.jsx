import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import TextFieldGroup from '../../../../common/TextFieldGroup'

class LoginForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			identifier: '',
			password: '',
			errors: {},
			isLoading: false
		};


		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);

	}
	
	onSubmit(e) {
		e.preventDefault();
	}

	onChange(e) {
		this.setState({ [e.target.name] : e.target.value });
	}

	render() {

		const { errors, identifier, password, isLoading } = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<h1>Login</h1>

				<TextFieldGroup
					field="identifier"
					label="Username / Email"
					value={identifier}
					error={errors.identifier}
					onChange={this.onChange}
				/>

				<TextFieldGroup
					field="password"
					label="password"
					value={password}
					error={errors.password}
					onChange={this.onChange}
				/>

				<div className="form-group"><Button disabled={isLoading}>Login</Button></div>
			</form>
	);
}
} 	

export default LoginForm;