/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';

import { AddBoxRounded, HomeOutlined, PersonOutlined } from '@mui/icons-material';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// import { BottomNavigation, BottomNavigationAction } from '@mui/material';
// import Box from '@material-ui/core/Box';
// import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(() => ({
// 	root:{
// 		color: 'black',
// 		'&$selected':{
// 			color: '#ff10ef'
// 		}
// 	},
// 	selected:{}
// }));

const useStyles = makeStyles({
	root:{
		width:'100%',
		position:'fixed',
		bottom:0,
		backgroundColor: '#303a4d',
		zIndex:100
	}
});

const BottomNavBar = () => {
	const classes = useStyles();
	const [value, setValue] = useState(0);
	const history = useHistory();
	
	useEffect(() => {
		if(value === 0){
			history.push('/');
		} else if(value === 1){
			history.push('/recipes');
		} else if(value === 2){
			history.push('/account');
		}
	},[value, history]);

	return (
		// <Box sx={{width: 500, position:'fixed', bottom:0, zIndex:100, backgroundColor: 'grey'}}>
		// 	<Paper sx={{position:'fixed', bottom:0, left:0, right:0}} elevation={3}>
		<BottomNavigation
			// style={{backgroundColor: '#303a4d'}}
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
			showLabels
			className={classes.root}
		>
			<BottomNavigationAction 
				style={{color:'#ff10ef'}} 
				label="Home" 
				icon={<HomeOutlined />} />
			<BottomNavigationAction 
				style={{color:'#ff10ef'}}  
				label='Add' 
				icon={<AddBoxRounded />} />
			<BottomNavigationAction 
				style={{color:'#ff10ef'}}  
				label="Account" 
				icon={<PersonOutlined />} />
		</BottomNavigation>
		// 	</Paper>
		// </Box>
	);
};

export default BottomNavBar;