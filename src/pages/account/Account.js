/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Avatar, Dialog, DialogActions, DialogContentText, DialogTitle, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { DefaultButton } from '../../components/Button/Button';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useUserDispatch } from '../../context/UserContext';
import { useQuery } from '@apollo/client';
import CURRENT_USER from '../auth/services/query';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import { checkExpiredToken } from '../../utils/checkExpiredToken';
import { btnStyles } from '../../styles/MuiButtonStyle';
import { Button, Card, CardContent } from '@material-ui/core';
import user_icons_init_state from '../../assets/images/user.png';
import './styles/account_style.css';

const Account = (props) => {
	const classes = btnStyles();
	let userDispatch = useUserDispatch();
	const history = useHistory();
	let token;

	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [content, setContent] = useState({});
	
	const { error, data } = useQuery(CURRENT_USER);

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

	const errorHandling = async(error) => {
		setMessage('Something went wrong....');

		if (error.networkError === null) {
			await setMessage(error.graphQLErrors[0].message);
			await checkExpiredToken(token, userDispatch, history);
		}

		if (error.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED') {
			setMessage('Token Expired');
			token = localStorage.removeItem('token');
			localStorage.removeItem('user');
			setTimeout(() => { 
				checkExpiredToken(token, userDispatch, history);
			}, 2000);
		}
	};

	const handleLogout = (dispatch, history) => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		dispatch({type: 'LOGOUT_SUCCESS'});
		history.push('/login');
	};

	useEffect(() => {
		if (data) {
			setContent(data.currentUser);
		}
		if (error) {
			return errorHandling(error);
		}
	},[data, error]);

	return (
		<React.Fragment>
			{
				error ? 
				<React.Fragment>
					<ErrorSnackbar message={message}/>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Avatar alt='profile image' src={user_icons_init_state}
							sx={{width: 100, height: 100, }}
						/>
						<div style={{paddingLeft: 10,display: 'flex', flexDirection: 'column'}}>
							<p style={{fontSize: '18px'}}>{content.fullname}</p>
							<Button
								disabled={true}
								classes={{text: classes.text}}
								onClick={() => history.push('/profile-detail')}
							>Show Profile</Button>
						</div>
					</div>
					<div style={{marginTop: 50}}>
						<Card className='glassmorphism_card'>
							<CardContent>
								<List
									dense
								>
									<ListItemButton 
										divider={true}
										onClick={redirectFavoritesPage}>
										<ListItemText 
											disableTypography
											primary={<Typography>Favorites</Typography>}
										/>
										<ArrowForwardIosRounded/>
									</ListItemButton>
									<ListItemButton 
										divider={true}
										onClick={redirectMyRecipesPage}>
										<ListItemText 
											disableTypography
											primary={<Typography>My Recipes</Typography>}
										/>
										<ArrowForwardIosRounded/>
									</ListItemButton>
									<ListItemButton 
										divider={true}
										onClick={redirectAboutPage}>
										<ListItemText 
											disableTypography
											primary={<Typography>About</Typography>}
										/>
										<ArrowForwardIosRounded/>
									</ListItemButton>
								</List>
								<div style={{paddingLeft: 17}}>
									<DefaultButton title='Logout' handlingEvents={handleClickOpen}/>
								</div>
							</CardContent>
						</Card>
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
							<Button color='error' onClick={() => handleLogout(userDispatch, props.history)}>Yes</Button>
							<Button color='primary' onClick={handleClickClose}>No</Button>
						</DialogActions>
					</Dialog>
				</React.Fragment>
				: <React.Fragment>
					<Card className='glassmorphism_card'>
						<CardContent>
							<div style={{display: 'flex', justifyContent: 'center'}}>
								<Avatar alt='profile image' src={content.image ? content.image : user_icons_init_state}
									sx={{width: 100, height: 100, }}
								/>
								<div style={{paddingLeft: 10,display: 'flex', flexDirection: 'column'}}>
									<Typography style={{fontSize: '18px', paddingBottom: 20.0, paddingTop: 10.0}}>
										{content.fullname}
									</Typography>
									<Button
										classes={{text: classes.text}}
										onClick={() => history.push('/profile-detail')}
									>Show Profile</Button>
								</div>
							</div>
						</CardContent>
					</Card>
					<div style={{marginTop: 50}}>
						<Card className='glassmorphism_card'>
							<CardContent>
								<List
									dense
								>
									<ListItemButton 
										divider={true}
										onClick={redirectFavoritesPage}>
										<ListItemText 
											disableTypography
											primary={<Typography>Favorites</Typography>}
										/>
										<ArrowForwardIosRounded/>
									</ListItemButton>
									<ListItemButton 
										divider={true}
										onClick={redirectMyRecipesPage}>
										<ListItemText 
											disableTypography
											primary={<Typography>My Recipes</Typography>}
										/>
										<ArrowForwardIosRounded/>
									</ListItemButton>
									<ListItemButton 
										divider={true}
										onClick={redirectAboutPage}>
										<ListItemText 
											disableTypography
											primary={<Typography>About</Typography>}
										/>
										<ArrowForwardIosRounded/>
									</ListItemButton>
								</List>
								<div style={{paddingLeft: 17}}>
									<DefaultButton title='Logout' handlingEvents={handleClickOpen}/>
								</div>
							</CardContent>
						</Card>
						
						<center>
							<p style={{marginTop: 90}}>v1.0.0</p>
						</center>
					</div>
					<Dialog
						PaperProps={{
							style: {
								backgroundColor: 'white',
								color: 'black',
								boxShadow: 'none',
							},
						}}
						open={open}
						onClose={handleClickClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id='alert-dialog-title'>
							<DialogContentText id='alert-dialog-description' sx={{color: 'black'}}>Are you sure want to logout?</DialogContentText>
						</DialogTitle>
						<DialogActions>
							<Button onClick={() => handleLogout(userDispatch, props.history)}>Yes</Button>
							<Button color='secondary' onClick={handleClickClose}>No</Button>
						</DialogActions>
					</Dialog>
				</React.Fragment>
			}
		</React.Fragment>
	);
};

export default Account;