/* eslint-disable no-unused-vars */
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingDetailPage } from '../../components/Loading/Loading';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import RECIPE_DETAIL from './services/recipe_detail_query';
import './styles/recipe.css';

const RecipeDetail = () => {
	let {id} = useParams();

	const {loading, error, data} = useQuery(RECIPE_DETAIL, {
		variables: {
			id
		}
	});
	const [loadPage, setLoadPage] = useState(loading);

	useEffect(async () => {
		const timer = setTimeout(async () => {
			await setLoadPage(false);
		}, 1000);
		return () => clearTimeout(timer);
	},[data]);

	return (
		<>
			{
				loadPage ? <LoadingDetailPage/>
				: error ? <ErrorSnackbar message={error.message}/> 
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