/* eslint-disable react/prop-types */
// import { AppRegistrationRounded } from '@mui/icons-material';
import { Alert, CardContent, CircularProgress, Grid, Snackbar, Stack, TextField } from '@mui/material';
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
import { btnStyles } from '../../styles/MuiButtonStyle';
import { Button, Card } from '@material-ui/core';
import Avatar from 'react-avatar-edit';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { base64toFile } from '../../utils/convertBase64toFile';
import { generateRandomString } from '../../utils/generateRandomString';

// TODO: open stickies on mac to see todo's detail

const SignUp = (props) => {
	const classes = btnStyles();
	// const avatarStyle = {backgroundColor: '#71b9be', marginBottom: '0.1px auto'};
	const btnStyle = {margin: '5px 0'};
	const marginBottomStyle = {marginBottom: '25px auto'};
	const color = '#246923';

	const customTheme = theme => {
		return{
			...theme,
			colors: {
				...theme.colors,
				secondary: 'white',
				primary: '#246923'
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
	const [src] = useState('');
	const [selectedImage, setSelectedImage] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const genderOptions = [
		{value: 'M', label: 'Male'},
		{value: 'F', label: 'Female'}
	];
	const today = new Date();
	const generateRandomImageName = generateRandomString(9);

	const onClose = () => {
		setSelectedImage('');
	};

	const onCrop = (preview) => {
		const imgFile = base64toFile(preview, generateRandomImageName);
		setSelectedImage(Object.assign(imgFile, {
			preview: URL.createObjectURL(imgFile)
		}));
	};

	const onBeforeFileLoad = (elem) => {
		if (elem.target.files[0].size > 5168000) {
			alert('File is too big!');
			elem.target.value = '';
		}
	};

	const handleImageUpload = (image) => {
		const storageRef = ref(storage, `user_images/${new Date().getTime()}-${image.name}`);
		const uploadTask = uploadBytesResumable(storageRef, image);

		uploadTask.on('state_changed',
			() => {
				// const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			},
			(error) => {
				alert(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImageUrl(downloadURL);
				});
			});
	};

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

	const handleRegisterUser = async (dispatch, history, setLoading, setError, values, imgUrl) => {
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
						birthDate: values.birthDate,
						image: imgUrl
					}
				}
			}).then(res => {
				localStorage.setItem('token', res.data.register.token);
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
			handleRegisterUser(userDispatch, props.history, setLoading, setError, values, imageUrl);
		},
		validationSchema,
		enableReinitialize: true
	});

	return (
		<React.Fragment>
			<Grid 
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justify="center"
				style={{ minHeight: '100vh'}}
			>
				<Card style={{minWidth:'345px'}}>
					<CardContent>
						<Grid align='center'>
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
							<div>
								<Avatar 
									width={300}
									height={290}
									onCrop={onCrop}
									onClose={onClose}
									onBeforeFileLoad={onBeforeFileLoad}
									src={src}
								/>
								<img 
									src={selectedImage.preview ? selectedImage.preview : imageUrl}
									alt='Preview'
								/>
								{selectedImage ? <button onClick={() => handleImageUpload(selectedImage)}>Upload</button> : null}
							</div>
							<TextField 
								id='fullname'
								name='fullname'
								label='Fullname' 
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
								<CircularProgress color='secondary' size={26} />
							</Box>
						) : (
							<Button 
								classes={{ contained: classes.contained }}
								type='submit' 
								variant='contained' 
								style={btnStyle} 
								fullWidth
							>
								Sign Up
							</Button>
						)
							}
						</form>
					</CardContent>
				</Card>
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
