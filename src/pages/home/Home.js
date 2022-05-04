/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import SingleContent from '../../components/SingleContent/SingleContent';
import './styles/home.css';
import CustomPagination from '../../components/Pagination/CustomPagination';
import { useQuery } from '@apollo/client';
import RECIPE_LIST from './service/recipe_query';
import {Loading} from '../../components/Loading/Loading';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';

const Home = () => {
	
	const [page, setPage] = useState(0);
	const [content, setContent] = useState([]);
	const {loading, error, data} = useQuery(RECIPE_LIST,{
		variables: {
			page
		}
	});	
	
	const [loadPage, setLoadPage] = useState(loading);

	useEffect(() => {
		if (data) {
			setContent(data);	
		}

		const timer = setTimeout(() => {
			setLoadPage(false);
		}, 500);
		return () => clearTimeout(timer);
	},[page,data]);
	return (
		<>
			{
			loadPage ? <Loading>
				<div>
					<span className='page-title'>Home</span>
					<div className='home'>
						{
							content.recipeList && content.recipeList.map((c) => <SingleContent 
								key={c.id}
								id={c.id}
								title={c.title}
								image={c.image.url}
								date={c.title}
								media_type={c.title}
								vote_average={c.servings}
							/>)
						}
					</div>
					<CustomPagination setPage={setPage}/>
				</div>
			</Loading>
				: error ? <ErrorSnackbar message={error.message}/>
					: <div>
						<span className='page-title'>Home</span>
						<div className='home'>
							{
								content.recipeList && content.recipeList.map((c) => <SingleContent 
									key={c.id}
									id={c.id}
									title={c.title}
									image={c.image.url}
									date={c.title}
									servings={c.servings}
									cooking_time={c.cookingTime}
								/>)
							}
						</div>
						<CustomPagination setPage={setPage}/>
					</div>
			} 
		</>
	);
};

export default Home;