/* eslint-disable react/prop-types */
import { Alert, CardContent, CircularProgress, Grid, Snackbar, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import { parseDateString } from '../../../utils/parseDateString';
import Select from 'react-select';
import { TextError } from '../../../components/TextError';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box } from '@mui/system';
import { formatDate } from '../../../utils/formatDate';
import { useMutation } from '@apollo/client';
import { USER_UPDATE } from '../services/mutations';
import { useUserDispatch } from '../../../context/UserContext';
import { useHistory } from 'react-router-dom';
import { checkExpiredToken } from '../../../utils/checkExpiredToken';
import { btnStyles } from '../../../styles/MuiButtonStyle';
import { Button, Card } from '@material-ui/core';
import Avatar from 'react-avatar-edit';
import { storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { base64toFile } from '../../../utils/convertBase64toFile';
import { generateRandomString } from '../../../utils/generateRandomString';

export const EditProfileForm = ({
	id,
	fullname,
	email,
	gender,
	birthDate,
	image
}) => {
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

	const genderOptions = [
		{value: 'M', label: 'Male'},
		{value: 'F', label: 'Female'}
	];

	let token;
	let userDispatch = useUserDispatch();
	const [selectedImage, setSelectedImage] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [src] = useState('');
	const history = useHistory();
	const btnClasses = btnStyles();
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

	const [userUpdate, {error}] = useMutation(USER_UPDATE);

	const today = new Date();

	const [loading, setLoading] = useState(false);
	const [err, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState('');

	const handleSnackBarClick = (success, error) => {
		setSuccess(success);
		setError(error);
	};

	const handleSnackbarErrorClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setError(false);
	};

	const handleSnackbarSuccessClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSuccess(false);
	};

	const handleUserUpdate = async (setLoading, setError, values, token, dispatch, history, image) => {
		setError(false);
		setLoading(true);
        
		setTimeout(() => { 
			userUpdate({
				variables: {
					id,
					input: {
						fullname: values.fullname,
						email: values.email,
						gender: values.gender,
						birthDate: values.birthDate,
						image
					}
				}
			}).then(() => {
				setError(false);
				setLoading(false);
				handleSnackBarClick(true, false);
				setMessage('Data berhasil diupdate');
			}).catch(err => {
				setError(true);
				setLoading(false);
				setMessage(err.message);
				handleSnackBarClick(false, true);	

				if (err.networkError === null ) {
					setError(true);
					setLoading(false);
					setMessage(err.message);
					handleSnackBarClick(false, true);	
					localStorage.removeItem('user');
					token = localStorage.removeItem('token');
					setTimeout(() => {
						checkExpiredToken(token, dispatch, history);
					}, 2000);
				}
				if (err.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED') {
					setMessage('Token Expired');
					localStorage.removeItem('user');
					token = localStorage.removeItem('token');
					setError(true);
					setLoading(false);
					handleSnackBarClick(false, true);
					setTimeout(() => {
						checkExpiredToken(token, dispatch, history);
					}, 2000);
				}
				if (err.networkError.result.errors[0].extensions.code === 'INTERNAL_SERVER_ERROR') {
					setError(true);
					setLoading(false);
					setMessage(err.networkError.result.errors[0].message);
					handleSnackBarClick(false, true);		
				}
			});
		}, 1000);
	};
    
	const validationSchema = yup.object({
		fullname: yup.string().trim().min(8).required('Fullname required'),
		email: yup.string().trim().email('Invalid email format').required('Email required'),
		gender: yup.string().ensure().required('Gender required'),
		birthDate: yup.date().transform(parseDateString).max(today).required('Birthdate required')
	});

	const formik = useFormik({
		initialValues : {
			fullname,
			email,
			gender,
			birthDate
		},
		onSubmit: (values) => {
			handleUserUpdate(setLoading, setError, values, token, userDispatch, history, imageUrl);
		},
		validationSchema,
		enableReinitialize: true
	});

	return (
		<React.Fragment>
			<Grid container
				spacing={0}
				direction="column"
				alignItems="center"
				justify="center"
				style={{ minHeight: '100vh'}}
			>
				<Card style={{minWidth:'345px'}}>
					<CardContent>
						<form 
							onSubmit={formik.handleSubmit}
							style={{
								display: 'flex',
								flexDirection: 'column',
								paddingLeft: '10px',
								gap: '1rem'   
							}}
						>
							<div style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column'
							}}>
								<Avatar 
									width={300}
									height={290}
									onCrop={onCrop}
									onClose={onClose}
									onBeforeFileLoad={onBeforeFileLoad}
									src={src}
								/>
								<img 
									src={
										selectedImage.preview ? selectedImage.preview : imageUrl ? imageUrl : image
									}
									alt='Preview'
								/>
								{selectedImage ? <button onClick={() => handleImageUpload(selectedImage)}>Upload</button> : null}
							</div>
							<TextField 
								id='fullname'
								name='fullname'
								label='Fullname' 
								variant='outlined' 
								placeholder='Enter Fullname' 
								fullWidth   
								style={marginBottomStyle} 
								onChange={formik.handleChange}
								value={formik.values.fullname}
								error={formik.touched.fullname && Boolean(formik.errors.fullname)}
								helperText={formik.touched.fullname && formik.errors.fullname}
								onBlur={formik.handleBlur}
								focused={true}
							/>
							<TextField 
								id='email'
								name='email'
								variant='outlined' 
								label='Email' 
								placeholder='Enter email' 
								fullWidth 
								style={marginBottomStyle} 
								onChange={formik.handleChange}
								value={formik.values.email}
								error={formik.touched.email && Boolean(formik.errors.email)}
								helperText={formik.touched.email && formik.errors.email}
								onBlur={formik.handleBlur}
								focused={true}
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
								<CircularProgress color='secondary' size={26}/>
							</Box>
						) : (
							<Button
								type='submit' 
								classes={{contained: btnClasses.contained}}
								variant='contained'
								fullWidth
							>
							Update
							</Button>
						)
							}
						</form>
					</CardContent>
				</Card>
			</Grid>
			{
				error ? <Stack spacing={2} sx={{width: '100%'}}>
					<Snackbar 
						open={err}
						autoHideDuration={3000}
						onClose={handleSnackbarErrorClose}
						anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
						key={'bottom' + 'right'} 
					>
						<Alert
							onClose={handleSnackbarErrorClose}
							severity='error' sx={{width: '100%'}}
						>
							{message}
						</Alert>
					</Snackbar>
				</Stack> : <Stack spacing={2} sx={{width: '100%'}}>
					<Snackbar 
						open={success}
						autoHideDuration={3000}
						onClose={handleSnackbarSuccessClose}
						anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
						key={'bottom' + 'right'} 
					>
						<Alert
							onClose={handleSnackbarSuccessClose}
							severity='success' sx={{width: '100%'}}
						>
							{message}
						</Alert>
					</Snackbar>
				</Stack>
			}
		</React.Fragment>
	);
};
