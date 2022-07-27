/* eslint-disable react/prop-types */
import { AppRegistrationRounded } from '@mui/icons-material';
import { Alert, Avatar, Button, CircularProgress, Grid, Paper, Snackbar, Stack, TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useState } from 'react';
import { useUserDispatch } from '../../context/UserContext';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Select from 'react-select';
import { formatDate } from '../../utils/formatDate';
import { useMutation } from '@apollo/client';
import { USER_REGISTER } from './services/mutations';
import { Box } from '@mui/system';
import { parseDateString } from '../../utils/parseDateString';
import { TextError } from '../../components/TextError';

const SignUp = (props) => {
	const paperStyle = {padding: 15, height: '78vh', width: 348, margin: '10px auto', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'};
	const avatarStyle = {backgroundColor: '#FF10F0', marginBottom: '0.1px auto'};
	const btnStyle = {margin: '5px 0'};
	const marginBottomStyle = {marginBottom: '25px auto'};
	const color = '#FF10F0';

	const customTheme = theme => {
		return{
			...theme,
			colors: {
				...theme.colors,
				secondary: 'white',
				primary: '#ad1897'
			}
		};
	};

	const selectStyles = {
		menu: base => ({
			...base,
			zIndex: 100
		})
	};

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errMsg, setErrMsg] = useState('');
	const genderOptions = [
		{value: 'M', label: 'Male'},
		{value: 'F', label: 'Female'}
	];
	const today = new Date();

	const validationSchema = yup.object({
		fullname: yup.string().trim().min(8).required('Fullname required'),
		email: yup.string().trim().email('Invalid email format').required('Email required'),
		password: yup.string().trim().min(8).required('Password required'),
		gender: yup.string().ensure().required('Gender required'),
		birthDate: yup.date().transform(parseDateString).max(today).required('Birthdate required')
	});

	let userDispatch = useUserDispatch();
	const [userRegister] =  useMutation(USER_REGISTER);

	const handleSnackBarClick = () => {
		setError(true);
	};

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setError(false);
	};

	const handleRegisterUser = async (dispatch, history, setLoading, setError, values) => {
		setError(false);
		setLoading(true);

		setTimeout(() => { 
			userRegister({
				variables: {
					input: {
						fullname: values.fullname,
						email: values.email,
						password: values.password,
						gender: values.gender,
						birthDate: values.birthDate
					}
				}
			}).then(res => {
				localStorage.setItem('user', JSON.stringify(res.data));
				setError(false);
				setLoading(false);
				dispatch({
					type: 'REGISTER_SUCCESS'
				});
				history.push('/');
			}).catch(err => {
				dispatch({
					type: 'REGISTER_FAILURE'
				});
				setError(true);
				setLoading(false);
				history.push('/signup');
				setErrMsg(err.message);
				handleSnackBarClick();
			});	
		}, 2000);
	};

	const formik = useFormik({
		initialValues : {
			fullname: '',
			email: '',
			password: '',
			gender: '',
			birthDate: ''
		},
		onSubmit: (values) => {
			handleRegisterUser(userDispatch, props.history, setLoading, setError, values);
		},
		validationSchema,
		enableReinitialize: true
	});

	return (
		<React.Fragment>
			<Grid sx={{overflowY: 'scroll', maxHeight: '200px'}} container spacing={2}>
				<Paper elevation={10} style={paperStyle}>
					<Grid align='center'>
						<Avatar style={avatarStyle}><AppRegistrationRounded/></Avatar>
						<h2 style={{marginBottom: 0.2}}>Sign Up</h2>
					</Grid>
					<form 
						onSubmit={formik.handleSubmit}
						style={{
							display: 'flex',
							flexDirection: 'column',
							paddingLeft: '10px',
							gap: '0.5rem'   
						}}
					>
						<TextField 
							id='fullname'
							name='fullname'
							label='Fullname' 
							color='secondary' 
							variant='standard' 
							placeholder='Enter Fullname' 
							fullWidth   
							style={marginBottomStyle} 
							onChange={formik.handleChange}
							value={formik.values.fullname}
							error={formik.touched.fullname && Boolean(formik.errors.fullname)}
							helperText={formik.touched.fullname && formik.errors.fullname}
							onBlur={formik.handleBlur}
						/>
						<TextField 
							id='email'
							name='email'
							color='secondary' 
							variant='standard' 
							label='Email' 
							placeholder='Enter email' 
							fullWidth 
							style={marginBottomStyle} 
							onChange={formik.handleChange}
							value={formik.values.email}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
							onBlur={formik.handleBlur}
						/>
						<TextField 
							id='password'
							name='password'
							type={'password'}
							color='secondary'
							variant='standard'
							label='Password'
							placeholder='Enter password'
							fullWidth
							style={marginBottomStyle} 
							onChange={formik.handleChange}
							value={formik.values.password}
							error={formik.touched.password && Boolean(formik.errors.password)}
							helperText={formik.touched.password && formik.errors.password}
							onBlur={formik.handleBlur}
						/>						
						<Select
							id='gender'
							name='gender'
							styles={selectStyles}
							theme={customTheme}
							options={genderOptions}
							onChange={(gender) => {
								formik.setFieldValue('gender', gender.value);
							
							}}
							value={genderOptions 
							? genderOptions.find((gender) => gender.value === formik.values.gender) 
							: ''}
							isSearchable={false}
							placeholder='Select Gender'
						/>
						<TextError message={formik.errors.gender}/>
						<br style={{marginBottom: 3}}/>
						<LocalizationProvider 
							dateAdapter={AdapterDateFns}>
							<Stack>
								<MobileDatePicker 
									maxDate={new Date(Date.now())}
									label='Birth Date'
									inputFormat='dd/MM/yyyy'
									sx={{
										svg: {color},
										color: {color},
										label: {color}
									}}
									value={formik.values.birthDate}
									onChange={(date) => {
										const selectedDate = formatDate(date.toDateString());
										formik.setFieldValue('birthDate',selectedDate);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</Stack>
						</LocalizationProvider>
						<TextError message={formik.errors.birthDate}/>
						<br style={{marginBottom: 2}}/>
						{
						loading ? (
							<Box sx={{display: 'flex', justifyContent: 'center'}}>
								<CircularProgress size={26} color='secondary'/>
							</Box>
						) : (
							<Button type='submit' color='secondary' variant='contained' style={btnStyle} fullWidth>Sign Up</Button>
						)
						}
					</form>
				</Paper>
			</Grid>
			<Stack spacing={2} sx={{ width: '100%' }}>
				<Snackbar
					open={error} 
					autoHideDuration={6000}
					onClose={handleSnackBarClose}
					anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
					key={'bottom' + 'right'} 
				>
					<Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
						{errMsg}
					</Alert>
				</Snackbar>
			</Stack>
		</React.Fragment>
	);
};

export default SignUp;

