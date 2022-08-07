/* eslint-disable no-unused-vars */
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LoadingDetailPage } from '../../components/Loading/Loading';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import { useUserDispatch } from '../../context/UserContext';
import { checkExpiredToken } from '../../utils/checkExpiredToken';
import RECIPE_DETAIL from './services/recipe_detail_query';
import './styles/recipe.css';

const RecipeDetail = () => {
	let {id} = useParams();
	let token;
	let userDispatch = useUserDispatch();
	const history = useHistory();

	const [message, setMessage] = useState('');
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
		return () => clearTimeout(timer);
	},[data, error]);

	return (
		<>
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
						<h4>{data.recipeDetail.title}</h4>
						<Typography>{data.recipeDetail.servings}</Typography>
						<Typography>{data.recipeDetail.cookingTime}</Typography>
					</div>
					<div className='instructions-ingredients-content'>
						<hr />
						<p>Ingredients :</p>
						<ul >
							{data.recipeDetail.ingredients.map((i) => {
								return <li key={i.id}>{i.ingredient}</li>;
							})}
						</ul>
					</div>
					<div className='instructions-ingredients-content'>
						<hr />
						<p>Instructions :</p>
						<ol >
							{data.recipeDetail.instructions.map((i) => {
								return <li key={i.id}>{i.instruction}</li>;
							})}
						</ol>
					</div>
				</div>
			}
		</>
	);
};

export default RecipeDetail;