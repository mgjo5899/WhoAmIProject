import React from 'react';
import './styles.css';
//import '../../style_global/animate.css';
//import ideas_bg from '../../images/ideas_bg.png';
// import Card from './Card';

import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
const Greeting = () =>{
	
	return(
		<div className='work-process-greeting'>
			<div className='content-section'>
				<div className='paragraph-section'>
					
                    <div className="row">
						<div className="col">
                            <h3>WhoAmI Project</h3>
                            <h5>
                                Create a board that represents yourself by only using data from social media.
                            </h5>
						</div>
						<div className="col2">
						    <RegisterForm/>
						</div>
					</div>
				</div>
				

			</div>


		</div>
	);
}
export default Greeting;