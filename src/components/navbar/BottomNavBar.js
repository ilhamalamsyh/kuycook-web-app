
import React, {useState, useEffect} from 'react';

import { AddBoxRounded, HomeRounded, PersonRounded } from '@mui/icons-material';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root:{
		width:'100%',
		position:'fixed',
		bottom:0,
		backgroundColor: 'white',
		zIndex:100
	}
});

const BottomNavBar = () => {
	const classes = useStyles();
	const [value, setValue] = useState();
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
		<BottomNavigation
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
			showLabels
			className={classes.root}
		>
			<BottomNavigationAction 
				style={{color:'#246923'}} 
				label="Home" 
				icon={<HomeRounded />} />
			<BottomNavigationAction 
				style={{color:'#246923'}}  
				label='Add' 
				icon={<AddBoxRounded />} />
			<BottomNavigationAction 
				style={{color:'#246923'}}  
				label="Account" 
				icon={<PersonRounded />} />
		</BottomNavigation>
	);
};

export default BottomNavBar;