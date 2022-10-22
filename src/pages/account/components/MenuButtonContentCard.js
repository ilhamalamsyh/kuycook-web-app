/* eslint-disable react/prop-types */
import { ArrowForwardIosRounded } from '@mui/icons-material';
import { Card, CardContent, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { DefaultButton } from '../../../components/Button/Button';

export const MenuButtonContentCard = ({directToFavoritePage, directToMyRecipePage, directToAboutPage, logout}) => {
	return (
		<Card 
			className='glassmorphism_card' 
			style={{
				background: 'rgba(36, 105, 35, 0.52)',
				borderRadius: '15px',
				boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
				backdropFilter: 'blur(3.6px)',
				'-webkit-backdrop-filter': 'blur(3.6px)',
				border: '1px solid rgba(36, 105, 35, 0.2)'
			}}>
			<CardContent>
				<List
					dense
				>
					<ListItemButton
						divider={true}
						onClick={directToFavoritePage}>
						<ListItemText
							disableTypography
							primary={<Typography>Favorites</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<ListItemButton 
						divider={true}
						onClick={directToMyRecipePage}>
						<ListItemText 
							disableTypography
							primary={<Typography>My Recipes</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<ListItemButton 
						divider={true}
						onClick={directToAboutPage}>
						<ListItemText 
							disableTypography
							primary={<Typography>About</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
				</List>
				<div style={{paddingLeft: 17}}>
					<DefaultButton title='Logout' handlingEvents={logout}/>
				</div>
			</CardContent>
		</Card>
	);
};
