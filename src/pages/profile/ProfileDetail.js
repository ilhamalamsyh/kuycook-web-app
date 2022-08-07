/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import CURRENT_USER from '../auth/services/query';
import { EditProfileForm } from './Components/EditProfileForm';
import { useUserDispatch } from '../../context/UserContext';
import { checkExpiredToken } from '../../utils/checkExpiredToken';
import { useHistory } from 'react-router-dom';

export const ProfileDetail = () => {
	let token;
	let userDispatch = useUserDispatch();
	const history = useHistory();

	const [message, setMessage] = useState('');
	const[content, setContent] = useState({});

	const { error, data } = useQuery(CURRENT_USER);

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
			setContent(data.currentUser);
		}
		if (error) {
			return errorHandling(error);
		}
	},[data, error]);

	return (
		<React.Fragment>
			{
				error ? 
				<React.Fragment>
					<ErrorSnackbar message={message}/> 
					<EditProfileForm 
						id={content.id}
						fullname={content.fullname}
						email={content.email}
						gender={content.gender}
						birthDate={content.birthDate}
					/>
				</React.Fragment>
				: <EditProfileForm 
					id={content.id}
					fullname={content.fullname}
					email={content.email}
					gender={content.gender}
					birthDate={content.birthDate}
				/>
			}
		</React.Fragment>
	);
};
