import React, { useState } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContentText, DialogTitle, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import {PrimaryButton, DefaultButton} from '../../components/Button/Button';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';


const Account = () => {
	const [open, setOpen] = useState(false);
	const history = useHistory();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClickClose = () => {
		setOpen(false);
	};

	const redirectMyRecipesPage = () => {
		history.push('/recipes');
	};

	const redirectFavoritesPage = () => {
		history.push('/');
	};

	const redirectAboutPage = () => {
		history.push('/about');
	};

	return (
		<>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<Avatar alt='profile image' src='https://img.okezone.com/content/2022/01/16/33/2532815/putus-dari-gigi-hadid-zayn-malik-gabung-aplikasi-kencan-online-D6gJjKZwDc.jpg'
					sx={{width: 100, height: 100, }}
				/>
				<div style={{paddingLeft: 10,display: 'flex', flexDirection: 'column'}}>
					<p>Ilham Alamsyah</p>
					<PrimaryButton title='Show Profile'/>
				</div>
			</div>
			<div style={{marginTop: 50}}>
				<List
					dense
				>
					<ListItemButton onClick={redirectFavoritesPage}>
						<ListItemText 
							disableTypography
							primary={<Typography style={{color: 'white', fontWeight: 'bold'}}>Favorites</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<hr />
					<ListItemButton onClick={redirectMyRecipesPage}>
						<ListItemText 
							disableTypography
							primary={<Typography style={{color: 'white', fontWeight: 'bold'}}>My Recipes</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<hr />
					<ListItemButton onClick={redirectAboutPage}>
						<ListItemText 
							disableTypography
							primary={<Typography style={{color: 'white', fontWeight: 'bold'}}>About</Typography>}
						/>
						<ArrowForwardIosRounded/>
					</ListItemButton>
					<hr />
				</List>
				<div style={{paddingLeft: 17}}>
					<DefaultButton title='Logout' handlingEvents={handleClickOpen}/>
				</div>
				<center>
					<p style={{marginTop: 90}}>v1.0.0</p>
				</center>
			</div>
			<Dialog
				PaperProps={{
					style: {
						backgroundColor: '#303a4d',
						boxShadow: 'none',
					},
				}}
				open={open}
				onClose={handleClickClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id='alert-dialog-title'>
					<DialogContentText id='alert-dialog-description' sx={{color: 'white'}}>Are you sure want to logout?</DialogContentText>
				</DialogTitle>
				<DialogActions>
					<Button color='error' onClick={handleClickClose}>Yes</Button>
					<Button color='primary' onClick={handleClickClose}>No</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Account;