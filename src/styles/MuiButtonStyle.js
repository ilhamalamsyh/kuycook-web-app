import { makeStyles } from '@material-ui/core/styles';

export const btnStyles = makeStyles({
	contained: {
		backgroundColor: '#246923',
		borderRadius: 20,
		margin: '8px 0',
		textTransform: 'none',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 5,
		paddingBottom: 5,
		color: '#ffe77aff',
		'&:hover': {
			backgroundColor: '#246923',
		},
	},
	outlined: {
		borderRadius: 20,
		margin: '8px 0',
		textTransform: 'none',
		color: '#246923',
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
