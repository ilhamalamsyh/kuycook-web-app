/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Badge } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { unavailable } from '../../config/config';
import './styles/single_content.css';

const SingleContent = ({
	id, 
	image,
	title,
	author,
	cooking_time,
}) => {
	const history = useHistory();

	return (
		<div onClick={() => history.push(`recipes/${id}`)} className='media'>
			<Badge sx={{marginRight: 3.3}} badgeContent={cooking_time} color={cooking_time > 6 ? 'secondary' : 'primary'} />
			<img
				className='image'
				src={ image ? `${image}` : unavailable}
				alt={title}
			/>
			<b className='title'>{title}</b>
			<span className='sub-title'>
				Chef {author.fullname}
			</span>
		</div>
	);
};

export default SingleContent;