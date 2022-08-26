/* eslint-disable react/prop-types */
import { createMuiTheme } from '@material-ui/core';
import { Pagination } from '@mui/material';
import React from 'react';
import { ThemeProvider } from 'styled-components';

const CustomPagination = ({
	setPage,
	numOfPages=10
}) => {

	const darkTheme = createMuiTheme({
		palette:{
			type:'dark'
		}
	});

	const handlePageChange = (page) => {
		setPage(parseInt(page - 1, 10));
		window.scroll(0,0);
	};

	return (
		<div
			style={{
				width:'100%',
				display: 'flex',
				justifyContent: 'center',
				marginTop: 10
			}}>
			<ThemeProvider theme={darkTheme}>
				<Pagination 
					count={numOfPages}
					onChange={(e) => handlePageChange(e.target.textContent)}
					hideNextButton
					hidePrevButton
					color='primary'
				/>
			</ThemeProvider>
		</div>
	);
};

export default CustomPagination;