/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import SingleContent from '../../components/SingleContent/SingleContent';
import './styles/home.css';
import CustomPagination from '../../components/Pagination/CustomPagination';
import { useQuery } from '@apollo/client';
import RECIPE_LIST from './service/recipe_query';
import {Loading} from '../../components/Loading/Loading';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import { checkExpiredToken } from '../../utils/checkExpiredToken';
import { useUserDispatch } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

const Home = () => {
	let token;
	let userDispatch = useUserDispatch();
	const history = useHistory();
	const [page, setPage] = useState(0);
	const [totalPage, setTotalPage] = useState(0);
	const [content, setContent] = useState([]);
	const [message, setMessage] = useState('');
	const {loading, error, data} = useQuery(RECIPE_LIST,{
		variables: {
			page
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

	useEffect(() => {
		if (data) {
			setContent(data.recipeList);	
			setTotalPage(data.recipeList.meta.totalPage);
		}
		const timer = setTimeout(() => {
			setLoadPage(false);
		}, 1000);
		if (error) {
			return errorHandling(error);
		}
		return () => clearTimeout(timer);
	},[page, data, error]);

	return (
		<>
			{
			loadPage ? <Loading>
				<div>
					<span className='page-title'>Home</span>
					<div className='home'>
						{
							content.recipes && content.recipes.map((c) => <SingleContent 
								key={c.id}
								id={c.id}
								title={c.title}
								image={c.image.url}
								date={c.title}
								media_type={c.title}
								author={c.author}
							/>)
						}
					</div>
					<CustomPagination setPage={setPage}/>
				</div>
			</Loading>
				: error ? <ErrorSnackbar message={message}/>
					: <div>
						<div className='home'>
							{
								content.recipes && content.recipes.map((c) => <SingleContent 
									key={c.id}
									id={c.id}
									title={c.title}
									image={c.image.url}
									date={c.title}
									author={c.author}
									cooking_time={c.cookingTime}
								/>)
							}
						</div>
						<CustomPagination setPage={setPage} numOfPages={totalPage}/>
					</div>
			} 
		</>
	);
};

export default Home;