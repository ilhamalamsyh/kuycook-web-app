/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { LockOutlined } from '@mui/icons-material';
import { Alert, Avatar, CardContent, CircularProgress, Grid, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_LOGIN } from './services/mutations';
import { useUserDispatch } from '../../context/UserContext';
import { Box } from '@mui/system';
import '../../components/Button/primaryButtonStyle.css';
import { btnStyles } from '../../styles/MuiButtonStyle';
import { Button, Card } from '@material-ui/core';

const Login = (props) => {
	const classes = btnStyles();
	const avatarStyle = {backgroundColor: '#71b9be'};
	const marginBottomStyle = {marginBottom: 8};

	const [error, setError] = useState(false);
	const [errMsg, setErrMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [emailValue, setEmailValue] = useState('');
	const [passwordValue, setPasswordValue] = useState('');

	const handleClick = () => {
		setError(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setError(false);
	};

	let userDispatch = useUserDispatch();
	const [loginAuth] = useMutation(USER_LOGIN);

	const handleLoginAuth = async (dispatch, email, password, history, setIsLoading, setError) => {
		setError(false);
		setIsLoading(true);

		if (!!email && !!password) {
			setTimeout(() => { 
				loginAuth({
					variables: {
						email: email,
						password: password
					}
				}).then(response => {
					localStorage.setItem('user',JSON.stringify(response.data));
					localStorage.setItem('token', response.data.login.token);
					setError(false);
					setIsLoading(false);
					dispatch({type: 'LOGIN_SUCCESS'});
					history.push('/');
				}).catch(err => {
					dispatch({type: 'LOGIN_FAILURE'});
					setError(true);
					setIsLoading(false);
					history.push('/login');
					setErrMsg(err.message);
					handleClick();
				});
			}, 1000);
		}
	};

	return (
		<React.Fragment>
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justify="center"
				style={{ minHeight: '100vh' }}
			>
				<Card>
					<CardContent>
						<Grid align='center'>
							<Avatar style={avatarStyle}>
								<LockOutlined />
							</Avatar>
							<h2>Login</h2>
						</Grid>
						<TextField
							id='email'
							value={emailValue}
							onChange={e => setEmailValue(e.target.value)}
							variant='standard' label='Email' placeholder='Enter email' fullWidth required style={marginBottomStyle} />
						<TextField
							id='password'
							value={passwordValue}
							onChange={e => setPasswordValue(e.target.value)}
							type={'password'} variant='standard' label='Password' placeholder='Enter password' fullWidth required style={marginBottomStyle} />
						{isLoading ? (
					<Box sx={{display: 'flex', justifyContent: 'center'}}>
						<CircularProgress size={26}/>
					</Box>
					) : (
					<Button
						classes={{ contained: classes.contained }}
						disabled={emailValue.length === 0 || passwordValue.length === 0}
						onClick={() => handleLoginAuth(
							userDispatch,
							emailValue,
							passwordValue,
							props.history,
							setIsLoading,
							setError
						)}
						type='submit'
						variant='contained'
						fullWidth
					>
						Log In
					</Button>
				)}
						<Typography align='right' style={{ marginTop: '10px' }}>
							<Link href='#'>Forgot password?</Link>
						</Typography>
						<Typography style={{ marginTop: '30px' }}>
							Do not have an account? 
							<Link to={'/signup'}> Sign Up</Link>
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Stack spacing={2} sx={{ width: '100%' }}>
				<Snackbar
					open={error} 
					autoHideDuration={6000}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
					key={'bottom' + 'right'} 
				>
					<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
						{errMsg}
					</Alert>
				</Snackbar>
			</Stack>
		</React.Fragment>
	);
};

export default Login;