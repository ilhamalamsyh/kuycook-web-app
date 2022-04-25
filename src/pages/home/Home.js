import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SingleContent from '../../components/SingleContent/SingleContent';
import './styles/home.css';
import CustomPagination from '../../components/Pagination/CustomPagination';


const Home = () => {
	const [page, setPage] = useState(1);
	const [content, setContent] = useState([]);

	const fetchHome = async () => {
		const {data} = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`);
		setContent(data.results);
		console.log('data: ', data.results);
	};

	useEffect(() => {
		fetchHome();
	},[page]);

	return (
		<div>
			<span className='page-title'>Home</span>
			<div className='home'>
				{
					content && content.map((c) => <SingleContent 
						key={c.id}
						id={c.id}
						title={c.title || c.name}
						poster={c.poster_path}
						date={c.first_air_date || c.release_date}
						media_type={c.media_type}
						vote_average={c.vote_average}
					/>)
				}
			</div>
			<CustomPagination setPage={setPage}/>
		</div>
		
	);
};

export default Home;