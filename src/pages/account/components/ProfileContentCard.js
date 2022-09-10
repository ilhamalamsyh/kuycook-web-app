/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '@material-ui/core';
import { Avatar, Card, CardContent, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

export const ProfileContentCard = ({userImage, defaultImage, username, style, isDisabled=false}) => {
	const history = useHistory();
	return (
		<Card 
			className='glassmorphism_card' 
			style={{
				background: 'rgba(113, 185, 190, 0.39)',
				borderRadius: '15px',
				boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
				backdropFilter: 'blur(6.4px)',
				border: '1px solid rgba(255, 255, 255, 0.21)'
			}}>
			<CardContent>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Avatar alt='profile image' src={userImage ? userImage : defaultImage}
						sx={{width: 100, height: 100, }}
					/>
					<div style={{paddingLeft: 10,display: 'flex', flexDirection: 'column'}}>
						<Typography style={{fontSize: '18px', paddingBottom: 20.0, paddingTop: 10.0}}>
							{username}
						</Typography>
						<Button
							disabled={isDisabled}
							classes={{text: style}}
							onClick={() => history.push('/profile-detail')}
						>Show Profile</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
