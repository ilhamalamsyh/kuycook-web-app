/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import Header from './components/Header/Header';
import './App.css';
import BottomNavBar from './components/navbar/BottomNavBar';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import Home from './pages/home/Home';
import Recipe from './pages/recipe/Recipe';
import Account from './pages/account/Account';
import RecipeDetail from './pages/recipe/RecipeDetail';
import About from './pages/about/About';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from
} from '@apollo/client';

import {onError} from '@apollo/client/link/error';
import { useUserDispatch, useUserState } from './context/UserContext';


const errorLink = onError(({graphqlErrors, networkErrors}) => {
	if (graphqlErrors) {
		graphqlErrors.map(({message, location,path}) => {
			alert(`Graphql error ${message}`);
		});
	}
});

const link = from([
	errorLink,
	new HttpLink({uri: `${process.env.REACT_APP_GRAPHQL_API}`})
]);

const client = new ApolloClient({
	cache: new InMemoryCache,
	link
});


const isAuth = false;



const App = () => {
	var { isAuthenticated } = useUserState();

	const PrivateRoute = ({children, ...rest}) => {
		return (
			<Route
				{...rest}
				render={props => 
				isAuthenticated ? (
					children
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: {
								from: props.location
							}
						}}
					/>
				)
				}
			/>
		);
	};

	function PublicRoute({ component, ...rest }) {
		return (
			<Route
				{...rest}
				render={props =>
					isAuthenticated ? (
						<Redirect
							to={{
								pathname: '/',
							}}
						/>
					) : (
						React.createElement(component, props)
					)
				}
			/>
		);
	}
	
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<Header/>
				<div className="app">
					<Container>
						<Switch>
							<Route exact path='/' component={Home} />
							{/* <Route exact path='/recipes' component={Recipe} /> */}
							<Route exact path='/login' component={Login} />
							<Route exact path='/signup' component={SignUp} />
							<Route exact path='/recipes/:id' component={RecipeDetail } />
							{/* <PublicRoute path='login' component={Login}/> */}
							{/* <Route path='/account' component={Account} />
							<Route path='/about' component={About} /> */}
							<PrivateRoute path='/recipes'>
								<Recipe />
							</PrivateRoute>
							<PrivateRoute path='/account'>
								<Account />
							</PrivateRoute>
							<PrivateRoute path='/about'>
								<About />
							</PrivateRoute>
						</Switch>
					</Container>
				</div>
				<BottomNavBar/>
			</BrowserRouter>
		</ApolloProvider>
	);
};

export default App;
