import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React from 'react';
import ingredient_image from '../../assets/images/ingredients_image.jpg';
import './styles/recipe.css';

const Recipe = () => {
	const history = useHistory();
	return (
		<React.Fragment>
			<div className='image-button-container'>
				<img
					src={ingredient_image}
					alt='Food Image'
				/>
				<Button className='add-recipe-button' onClick={() => history.push('/recipes/create')}>
						Add Recipe
				</Button>
			</div>
		</React.Fragment>
	);
};

export default Recipe;