import { makeStyles } from '@material-ui/core/styles';

export const btnStyles = makeStyles({
	contained: {
		backgroundColor: '#71b9be',
		borderRadius: 20,
		margin: '8px 0',
		textTransform: 'none',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 5,
		paddingBottom: 5,
		color: 'white',
		'&:hover': {
			backgroundColor: '#71b9be',
		},
	},
	outlined: {
		borderRadius: 20,
		margin: '8px 0',
		textTransform: 'none',
		color: '#0d2635',
	},
	text: {
		borderRadius: 20,
		margin: '8px 0',
		textTransform: 'none',
		fontWeight: 'bold',
		color: '#0d2635',
		'&:hover': {
			backgroundColor: 'white',
		},
	},
});
