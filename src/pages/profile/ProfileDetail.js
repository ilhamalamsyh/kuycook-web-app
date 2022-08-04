/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ErrorSnackbar } from '../../components/Snackbar/CustomizedSnackbars';
import CURRENT_USER from '../auth/services/query';
import { EditProfileForm } from './Components/EditProfileForm';

export const ProfileDetail = () => {
	const[content, setContent] = useState({});

	const { error, data } = useQuery(CURRENT_USER,{fetchPolicy: 'network-only'});

	useEffect(() => {
		if (data) {
			setContent(data.currentUser);
		}
		
	},[data]);

	return (
		<React.Fragment>
			{
				error ? 
				<React.Fragment>
					<ErrorSnackbar message={error.message}/> 
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
