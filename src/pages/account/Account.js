/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useUserDispatch } from '../../context/UserContext';
import { useQuery } from '@apollo/client';
import CURRENT_USER from '../auth/services/query';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import { checkExpiredToken } from '../../utils/checkExpiredToken';
import { btnStyles } from '../../styles/MuiButtonStyle';
import { Button } from '@material-ui/core';
import user_icons_init_state from '../../assets/images/user.png';
import './styles/account_style.css';
import { ProfileContentCard } from './components/ProfileContentCard';
import { MenuButtonContentCard } from './components/MenuButtonContentCard';

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
					<ProfileContentCard
						isDisabled={true}
						userImage={content.image}
						defaultImage={user_icons_init_state}
						username={content.fullname}
						style={classes.text}
					/>
					<div style={{marginTop: 50}}>
						<MenuButtonContentCard 
							directToAboutPage={redirectAboutPage}
							directToFavoritePage={redirectFavoritesPage}
							directToMyRecipePage={redirectMyRecipesPage}
							logout={handleClickOpen}
						/>
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
					<ProfileContentCard
						userImage={content.image}
						defaultImage={user_icons_init_state}
						username={content.fullname}
						style={classes.text}
					/>
					<div style={{marginTop: 50}}>
						<MenuButtonContentCard 
							directToAboutPage={redirectAboutPage}
							directToFavoritePage={redirectFavoritesPage}
							directToMyRecipePage={redirectMyRecipesPage}
							logout={handleClickOpen}
						/>
						<Typography style={{
							textAlign:'center', 
							marginTop: 'calc(10% + 45px)'}}>
							v1.0.0
						</Typography>
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