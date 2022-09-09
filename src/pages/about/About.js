import {Card, CardContent } from '@mui/material';
import React from 'react';

const About = () => {
	return (
		<Card style={{borderRadius: 8.0}}>
			<CardContent>
				<div>
					<span className='pageTitle'>About Us</span>
					<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default About;