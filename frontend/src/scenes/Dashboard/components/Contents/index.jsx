import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Button, ButtonIcon } from 'rmwc/Button';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';

import { Fab } from 'rmwc/Fab';

import './styles.css';

const right = {
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'row-reverse',
	marginRight: '2em',
	marginTop: '1em',
};

class Contents extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.handleClick = this.handleClick.bind(this);
		this.getPassword = this.getPassword.bind(this);
		this.getEmail = this.getEmail.bind(this);
	}

	handleClick(){
		this.props.doLogin(this.state.email, this.state.password);
	}
	

	getPassword(event) {
		this.setState({password:event.target.value})
	}
	
	getEmail(event) {
		this.setState({email:event.target.value})
	}

	render() {
		return (
			<div>
			<MuiThemeProvider>
				<br/>
			  <div style={right}>					
					<Fab className="fab-style" icon="add" />
			 </div>
			 </MuiThemeProvider>
		  </div>
		);
	}
} 	

export default Contents;
