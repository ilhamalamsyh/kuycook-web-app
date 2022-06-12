import React from 'react';
import { Avatar, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import {PrimaryButton, DefaultButton} from '../../components/Button/Button';
import { ArrowForwardIosRounded } from '@mui/icons-material';

const Account = () => {
	return (
		<>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<Avatar alt='profile image' src='https://img.okezone.com/content/2022/01/16/33/2532815/putus-dari-gigi-hadid-zayn-malik-gabung-aplikasi-kencan-online-D6gJjKZwDc.jpg'
					sx={{width: 100, height: 100, }}
				/>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<p>Ilham Alamsyah</p>
					<PrimaryButton title='Show Profile'/>
				</div>
			</div>
			<div style={{marginTop: 50}}>
				<List
					dense
				>
					<ListItemButton>
						<ListItemText 
							disableTypography
							primary={<Typography style={{color: 'white', fontWeight: 'bold'}}>Favorites</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<hr />
					<ListItemButton>
						<ListItemText 
							disableTypography
							primary={<Typography style={{color: 'white', fontWeight: 'bold'}}>My Recipes</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<hr />
					<ListItemButton>
						<ListItemText 
							disableTypography
							primary={<Typography style={{color: 'white', fontWeight: 'bold'}}>About</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<hr />
				</List>
				<div style={{paddingLeft: 17}}>
					<DefaultButton title='Logout'/>
				</div>
				<center>
					<p style={{marginTop: 90}}>v1.0.0</p>
				</center>
			</div>
			
		</>

	);
};

export default Account;