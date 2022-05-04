/* eslint-disable react/prop-types */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SuccessSnackbar = ({message}) => {
	const [open, setOpen] = React.useState(true);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false); 
	};

	return (
		<Stack spacing={2} sx={{ width: '100%' }}>
			<Snackbar 
				open={open} 
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
				key={'bottom' + 'right'} 
			>
				<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</Stack>
	);
};

const ErrorSnackbar = ({message}) => {
	const [open, setOpen] = React.useState(true);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false); 
	};

	return (
		<Stack spacing={2} sx={{ width: '100%' }}>
			<Snackbar 
				open={open} 
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
				key={'bottom' + 'right'} 
			>
				<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</Stack>
	);
};

export {SuccessSnackbar, ErrorSnackbar};