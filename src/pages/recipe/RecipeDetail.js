
import { useQuery } from '@apollo/client';
import { Divider, IconButton, Menu, MenuItem, Snackbar, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LoadingDetailPage } from '../../components/Loading/Loading';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import { useUserDispatch } from '../../context/UserContext';
import { checkExpiredToken } from '../../utils/checkExpiredToken';
import RECIPE_DETAIL from './services/recipe_detail_query';
import './styles/recipe.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Stack } from '@mui/material';
import user_icons_init_state from '../../assets/images/user.png';

const recipeDetailMenus = [
	'Share',
	'Edit'
];

const recipeDetailMenuSingle = [
	'Share'
];

const RecipeDetail = () => {
	let {id} = useParams();
	let token;
	let userDispatch = useUserDispatch();
	const history = useHistory();
	const ITEM_HEIGHT = 48; 
	const [isEditable, setIsEditable] = useState(false);
	const currentUserId = JSON.parse(localStorage.getItem('user'));
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const open = Boolean(anchorEl);
	const [message, setMessage] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);

	const {loading, error, data} = useQuery(RECIPE_DETAIL, {
		variables: {
			id
		}
	});
	const [loadPage, setLoadPage] = useState(loading);

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

	useEffect(async () => {
		const timer = setTimeout(async () => {
			await setLoadPage(false);
		}, 1000);
		if (error) {
			return errorHandling(error);
		}

		if (currentUserId == null || currentUserId.login.user.id !== data.recipeDetail.author.id) {
			setIsEditable(false);
		}else if(currentUserId.login.user.id === data.recipeDetail.author.id){
			setIsEditable(true);
		}
		
		return () => clearTimeout(timer);
	},[data, error]);
	
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		if (index === 0) {
			setOpenSnackbar(true);
			navigator.clipboard.writeText(window.location.toString());
		}
		if (index === 1) {
			history.push(`/recipes/${data.recipeDetail.id}/edit`);
		}
		setAnchorEl(null);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (isEditable) {
		recipeDetailMenus;
	}else{
		recipeDetailMenuSingle;
	}
	
	return (
		<React.Fragment>
			{
				loadPage ? <LoadingDetailPage/>
				: error ? <ErrorSnackbar message={message}/> 
				:  <div className='detail-content'>
					<img
						className='recipe-image-detail'
						alt='recipeImage'
						src={`${data.recipeDetail.image.url}`}
					/>
					<div className='title-content'>
						<div style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginBottom: '1rem'
						}}>
							<Typography style={{fontSize: 35, fontWeight: 'bold'}}>{data.recipeDetail.title}</Typography>
							<div style={{marginTop: 7.0}}>
								<IconButton
									aria-label="more"
									id="long-button"
									aria-controls={open ? 'long-menu' : undefined}
									aria-expanded={open ? 'true' : undefined}
									aria-haspopup="true"
									onClick={handleClick}
								>
									<MoreVertIcon />
								</IconButton>
								<Menu
									id="long-menu"
									keepMounted
									MenuListProps={{
										'aria-labelledby': 'long-button',
									}}
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									PaperProps={{
										style: {
											maxHeight: ITEM_HEIGHT * 4.5,
											width: '20ch',
										},
									}}
								>
									{ isEditable ? recipeDetailMenus.map((option, index) => (
										<MenuItem 
											key={option} 
											selected={index === selectedIndex} 
											onClick={event => handleMenuItemClick(event, index)}>
											{option}
										</MenuItem>
									)) : recipeDetailMenuSingle.map((option, index) => (
										<MenuItem 
											key={option} 
											selected={index === selectedIndex} 
											onClick={event => handleMenuItemClick(event, index)}>
											{option}
										</MenuItem>
									))}
								</Menu>
							</div>
						</div>
						<div style={{display: 'flex'}}>
							<Avatar
								alt='profile image' src={data.recipeDetail.author.image ? data.recipeDetail.author.image : user_icons_init_state}
								sx={{width: 50, height: 50, }}
							/>
							<div style={{paddingLeft: 10,display: 'flex', flexDirection: 'column'}}> 
								<Typography 
									style={{color: '#b3bec6', paddingBottom: 8.0, paddingTop: 5.0,fontWeight: 'bold'}} 
									variant='body2'>
							Chef {data.recipeDetail.author.fullname}
								</Typography>
								<Typography 
									style={{color: '#b3bec6',fontWeight: 'bold'}} 
									variant='body2'>
									{data.recipeDetail.author.email}
								</Typography>
							</div>
						</div>
						<Divider  
							style={{
								border: 'none',
								marginTop: '5px',
								borderTop: '1px dotted #b3bec6',
								color: '#fff',
								backgroundColor: '#fff',
								height: '1px',
								width: '95%'
							}}
						/>
						<Typography style={{marginTop:10}}>{data.recipeDetail.servings}</Typography>
						<Typography>{data.recipeDetail.cookingTime}</Typography>
					</div>
					<div className='instructions-ingredients-content'>
						<hr />
						<p>Ingredients :</p>
						<ul >
							{data.recipeDetail.ingredients.map((i) => {
								return <>
									<li key={i.id}>{i.ingredient}</li>
									<Divider  
										style={{
											border: 'none',
											borderTop: '1px dotted #b3bec6',
											color: '#fff',
											backgroundColor: '#fff',
											height: '1px',
											width: '95%'
										}}
									/>
								</>;
							})}
						</ul>
						
					</div>
					<div className='instructions-ingredients-content'>
						<hr />
						<p>Instructions :</p>
						<ol >
							{data.recipeDetail.instructions.map((i) => {
								return <>
									<li key={i.id}>{i.instruction}</li>
									<Divider  
										style={{
											border: 'none',
											borderTop: '1px dotted #b3bec6',
											color: '#fff',
											backgroundColor: '#fff',
											height: '1px',
											width: '95%'
										}}
									/>
								</>;
							})}
						</ol>
					</div>
				</div>
			}
			<Stack>
				<Snackbar 
					message='Copied to clipboard'
					anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
					autoHideDuration={1000}
					onClose={() => setOpenSnackbar(false)}
					open={openSnackbar}
				/>
			</Stack>
		</React.Fragment>
	);
};

export default RecipeDetail;