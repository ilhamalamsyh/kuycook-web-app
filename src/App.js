import React from 'react';
import Header from './components/Header/Header';
import './App.css';
import BottomNavBar from './components/navbar/BottomNavBar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import Home from './pages/home/Home';
import Recipe from './pages/recipe/Recipe';
import Account from './pages/account/Account';

const App = () => {
	return (
		<BrowserRouter>
			<Header/>
			<div className="app">
				<Container>
					<Switch>
						<Route exact path='/' component={Home} />
						<Route exact path='/recipes' component={Recipe} />
						<Route path='/account' component={Account} />
					</Switch>
				</Container>
			</div>
			<BottomNavBar/>
		</BrowserRouter>
	);
};

export default App;
