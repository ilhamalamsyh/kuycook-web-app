import React, { useCallback, useEffect, useState } from 'react';
import { useUserDispatch } from '../../context/UserContext';
import * as yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Button, Card, CardContent, CircularProgress, Divider, Fade, Grid, makeStyles, Snackbar, Typography } from '@material-ui/core';
import { TextField } from 'formik-mui';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_RECIPE, UPDATE_RECIPE } from './services/mutations';
import { Alert, Stack } from '@mui/material';
import { checkExpiredToken } from '../../utils/checkExpiredToken';
import RECIPE_DETAIL from './services/recipe_detail_query';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles((theme) => ({
	errorColor: {
		color: theme.palette.error.main
	},
	noWrap: {
		[theme.breakpoints.up('sm')] : {
			flexWrap: 'nowrap'
		},
	},
}));

export const RecipeForm = () => {
	let token;
	let userDispatch = useUserDispatch();
	const history = useHistory();
	const location = useLocation();
	const url  = location.pathname.split('/');
	const lastPath = url.pop();
	const id = url[url.length - 1];
	const classes = useStyles();

	const [recipe, setRecipe] = useState({});
	const [loading, setLoading] = useState(true);
	const [fail, setFail] = useState(false);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressPercent, setProgressPercent] = useState(0);
	const [imageUrl, setImageUrl] = useState('');
	const [waitingUploadImage, setWaitingUploadImage] = useState(false);

	if (lastPath === 'edit') {
		const {data} = useQuery(RECIPE_DETAIL, {
			variables: {
				id
			}
		});
		useEffect(async () => {
			setRecipe(data.recipeDetail);
			setLoading(false);
		},[data]);
	}else{
		setTimeout(() => {
			setLoading(false);
		});
	}

	const [createRecipe, {error}] = useMutation(CREATE_RECIPE);
	const [updateRecipe, {error: errorUpdate}] = useMutation(UPDATE_RECIPE);

	const handleSnackbarClick = (success, error) => {
		setSuccess(success);
		setFail(error);
	};

	const handleSnackbarErrorClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setFail(false);
	};

	const handleSnackbarSuccessClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSuccess(false);
	};

	useEffect(() => {
		setWaitingUploadImage(true);
	}, [waitingUploadImage, imageUrl, progressPercent]);
	

	const handleCreateRecipe = async (setFail, values, token, dispatch, history) => {
		setFail(false);

		setTimeout(async () => {

			createRecipe({
				variables: {
					input:{
						title: values.title,
						servings: values.servings,
						cookingTime: values.cookingTime,
						ingredients: values.ingredients,
						instructions: values.instructions,
						image: values.image
					}
				}
			}).then(res => {
				setFail(false);
				setSuccess(true);
				setMessage('Recipe created :)');
				handleSnackbarClick(true, false);
				setRecipe(res);
			}).catch(err => {
				setFail(true);
				setSuccess(false);
				setMessage(err.message);
				handleSnackbarClick( false, true);

				if (err.networkError === null ) {
					setFail(true);
					setMessage(err.message);
					handleSnackbarClick(false, true);	
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
					setFail(true);
					handleSnackbarClick(false, true);
					setTimeout(() => {
						checkExpiredToken(token, dispatch, history);
					}, 2000);
				}
				if (err.networkError.result.errors[0].extensions.code === 'INTERNAL_SERVER_ERROR') {
					setFail(true);
					setMessage(err.networkError.result.errors[0].message);
					handleSnackbarClick(false, true);		
				}
			});
		});
	};

	const handleUpdateRecipe = async (setFail, id, values, token, dispatch, history) => {
		setFail(false);

		setTimeout(async () => {
			updateRecipe({
				variables: {
					id,
					input:{
						title: values.title,
						servings: values.servings,
						cookingTime: values.cookingTime,
						ingredients: values.ingredients,
						instructions: values.instructions,
						image: values.image
					}
				}
			}).then(res => {
				setFail(false);
				setSuccess(true);
				setMessage('Recipe updated :)');
				handleSnackbarClick(true, false);
				setRecipe(res);
			}).catch(err => {
				setFail(true);
				setSuccess(false);
				setMessage(err.message);
				handleSnackbarClick( false, true);

				if (err.networkError === null ) {
					setFail(true);
					setMessage(err.message);
					handleSnackbarClick(false, true);	
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
					setFail(true);
					handleSnackbarClick(false, true);
					setTimeout(() => {
						checkExpiredToken(token, dispatch, history);
					}, 2000);
				}
				if (err.networkError.result.errors[0].extensions.code === 'INTERNAL_SERVER_ERROR') {
					setFail(true);
					setMessage(err.networkError.result.errors[0].message);
					handleSnackbarClick(false, true);		
				}
			});
		});
	};

	const handleCancelButton = () => {
		history.goBack();
	};

	const uploadImageToFirebase = (imageUrl) => {
		const storageRef = ref(storage, `files/${new Date().getTime()}-${imageUrl.name}`);
		const uploadTask = uploadBytesResumable(storageRef, imageUrl);
		
		uploadTask.on('state_changed',
			(snapshot) => {
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				setProgressPercent(progress);
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

	const onDrop = useCallback(acceptedFiles => {
		const file = acceptedFiles[0];
		if(!file) return;

		setImageUrl(Object.assign(file,{
			preview: URL.createObjectURL(file)
		}));

		uploadImageToFirebase(file);
	}, []);

	const {getRootProps, getInputProps} = useDropzone({onDrop, multiple: false , accept: {
		'image/*': ['.jpeg', '.png']
	}});

	const validationSchema = yup.object({
		title: yup.string().trim().required('Title required.'),
		image: yup.string().trim().required('Image required.'),
		servings: yup.string().trim().required('Servings required.').min(1, 'at least 1 character'),
		cookingTime: yup.string().trim().required('Cooking time required.').min(1, 'at least 1 character'),
		ingredients: yup.array().of(yup.string().required('Ingredient required').min(3, 'minimum 3 characters')).required('There is at least one ingredient.'),
		instructions: yup.array().of(yup.string().required('Instruction required').min(3, 'minimum 3 characters')).required('There is at least one instruction.')
	});

	return (
		<React.Fragment>
			<Card>
				<CardContent>
					{
						loading ? <p>Loading...</p> : <Formik
							initialValues={{
								title: recipe.title ? recipe.title : '',
								image: recipe.image ? recipe.image.url : 'no image uploaded',
								servings: recipe.servings ? recipe.servings : '',
								cookingTime: recipe.cookingTime ? recipe.cookingTime : '',
								ingredients: recipe.ingredients ? recipe.ingredients.map(({ingredient}) => ingredient) : [],
								instructions: recipe.instructions ? recipe.instructions.map(({instruction}) => instruction) : []
							}}
							validationSchema={validationSchema}
							onSubmit={async (values) => {
								if (lastPath === 'edit') {
									if(imageUrl !== '' || values.image !== 'no image uploaded'){
										values.image = imageUrl;
									}
									handleUpdateRecipe(setFail, id, values, token, userDispatch, history);
									setTimeout(() => {
										history.goBack();
									}, 2000);
								}else{
									if(imageUrl !== '' || values.image !== 'no image uploaded'){
										values.image = imageUrl;
									}
									handleCreateRecipe(setFail, values, token, userDispatch, history);
									setTimeout(() => {
										history.goBack();
									}, 2000);
								}
							}}
						>
							{({ values, errors, isSubmitting }) => (
								<Form autoComplete='off'>
									<Grid container direction='column' spacing={2}>
										<Grid item>
											<Typography style={{fontWeight: 'bold'}} variant='body1'>Recipe Data</Typography>
										</Grid>
										<Divider style={{marginBottom: 10}}/>
										<Grid item>
											<Field 
												fullWidth
												name='title'
												component={TextField}
												label='Title'
												color='secondary'
											/>
										</Grid>
										<Grid item>
											<Fade in={error}>
												<Field 
													fullWidth
													disabled={true}
													name='image'
													dateTime
													component={TextField}
													label='Image'
													color='secondary'
												/>
											</Fade>
										</Grid>
										<Grid item>
											<div {...getRootProps({
												className: 'dropzone'
											})}>
												<input id='image' name='image' {...getInputProps()} />
												<p>Drag & drop an image here, or click to select file</p>
											</div>
											{lastPath === 'edit' ? 
											<div>
												<img
													src={imageUrl.preview ? imageUrl.preview : imageUrl !== '' ? imageUrl : recipe.image.url}
													style={{width: '200px', borderRadius: '8px', marginTop: '10px'}}
												/>
											</div>
											: <div>
												<img
													src={imageUrl.preview ? imageUrl.preview : imageUrl}
													style={{width: '200px', borderRadius: '8px', marginTop: '10px'}}
												/>
											</div>		
											}
										</Grid>
										<Grid item>
											<Field 
												fullWidth
												name='servings'
												component={TextField}
												label='Servings'
												color='secondary'
											/>
										</Grid>
										<Grid item>
											<Field 
												fullWidth
												color='secondary'
												name='cookingTime'
												component={TextField}
												label='Cooking Time'
											/>
										</Grid>
										<FieldArray name='ingredients'>
											{({push, remove}) => (
												<React.Fragment>
													<Grid item> 
														<Typography style={{fontWeight: 'bold'}} variant='body2'>Ingredients : </Typography>
													</Grid>
													{values.ingredients.map((_, index) => (
														<Grid
															container
															item
															className={classes.noWrap}
															key={index}
															spacing={2}
														>
															<Grid 
																item
																container
																spacing={2}
																xs={12}
																sm='auto'
															>
																<Grid item xs={12} sm={6}>
																	<Field
																		fullWidth
																		name={`ingredients[${index}]`}
																		component={TextField}
																		label='Ingredient'
																		color='secondary'
																	/>
																</Grid>
															</Grid>
															<Grid item xs={12} sm='auto'>
																<Button
																	disabled={isSubmitting}
																	onClick={() => remove(index)}
																>Delete</Button>
															</Grid>
														</Grid>
													))}

													<Grid item>
														{typeof errors.ingredients === 'string' ? (
														<Typography color='error'>{errors.ingredients}</Typography>
													) : null}
													</Grid>

													<Grid item>
														<Button
															className='add-ingredient-instruction-btn'
															variant='outlined'
															color='secondary'
															disabled={isSubmitting}
															onClick={() => push('')}
														>Add Ingredient</Button>
													</Grid>
												</React.Fragment>
											)}
										</FieldArray>
										<FieldArray name='instructions'>
											{({push, remove}) => (
												<React.Fragment>
													<Grid item> 
														<Typography style={{fontWeight: 'bold'}} variant='body2'>Instructions : </Typography>
													</Grid>
													{values.instructions.map((_, index) => (
														<Grid
															container
															item
															className={classes.noWrap}
															key={index}
															spacing={2}
														>
															<Grid 
																item
																container
																spacing={2}
																xs={12}
																sm='auto'
															>
																<Grid item xs={12} sm={6}>
																	<Field
																		fullWidth
																		name={`instructions[${index}]`}
																		component={TextField}
																		label='Instruction'
																		color='secondary'
																	/>
																</Grid>
															</Grid>
															<Grid item xs={12} sm='auto'>
																<Button
																	disabled={isSubmitting}
																	onClick={() => remove(index)}
																>Delete</Button>
															</Grid>
														</Grid>
													))}

													<Grid item>
														{typeof errors.instructions === 'string' ? (
														<Typography color='error'>{errors.instructions}</Typography>
													) : null}
													</Grid>

													<Grid item>
														<Button
															style={{textTransform: 'none'}}
															variant='outlined'
															color='secondary'
															className='add-ingredient-instruction-btn'
															disabled={isSubmitting}
															onClick={() => push('')}
														>Add Instruction</Button>
													</Grid>
												</React.Fragment>
											)}
										</FieldArray>

										<Divider style={{marginBottom: 10}}/>
										<Grid container direction='row' spacing={2}>
											{ lastPath === 'create' ? 
									<Grid item>
										<Button
											disabled={isSubmitting}
											type='submit'
											variant='contained'
											color='secondary'
											startIcon={
												isSubmitting ? (
													<CircularProgress size='0.9rem'/>
												) : undefined
											}
										>
											{isSubmitting ? 'Creating' : 'Create'}
										</Button>
									</Grid> 
									: <Grid item>
										<Button
											disabled={isSubmitting}
											type='submit'
											variant='contained'
											color='secondary'
											startIcon={
												isSubmitting ? (
													<CircularProgress size='0.9rem'/>
												) : undefined
											}
										>
											{isSubmitting ? 'Updating' : 'Update'}
										</Button>
									</Grid>
											}
											<Grid item>
												<Button onClick={handleCancelButton}>
											Cancel
												</Button>
											</Grid>
										</Grid>
									</Grid>
								</Form>
							)}
						</Formik>
					}
				</CardContent>
			</Card>
			{
				error || errorUpdate ? <Stack spacing={2} sx={{width: '100%'}}>
					<Snackbar
						open={fail}
						autoHideDuration={3000}
						onClose={handleSnackbarErrorClose}
						anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
						key={'bottom' + 'right'}
					>
						<Alert 
							onClose={handleSnackbarErrorClose}
							severity='error'
							sx={{width: '100%'}}
						>
							{message}
						</Alert>
					</Snackbar>
				</Stack> :  <Stack spacing={2} sx={{width: '100%'}}>
					<Snackbar
						open={success}
						autoHideDuration={3000}
						onClose={handleSnackbarSuccessClose}
						anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
						key={'bottom' + 'right'}
					>
						<Alert 
							onClose={handleSnackbarSuccessClose}
							severity='success'
							sx={{width: '100%'}}
						>
							{message}
						</Alert>
					</Snackbar>
				</Stack>
			}
		</React.Fragment>
	);
};
