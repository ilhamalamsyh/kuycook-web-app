import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext';
import { CssBaseline } from '@material-ui/core';

ReactDOM.render(
	<UserProvider>
		<CssBaseline/>
		<App />
	</UserProvider>, 
	document.getElementById('root')
);