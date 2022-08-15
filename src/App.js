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
	from,
	createHttpLink
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

import {onError} from '@apollo/client/link/error';
import { useUserDispatch, useUserState } from './context/UserContext';
import { ProfileDetail } from './pages/profile/ProfileDetail';
import { RecipeForm } from './pages/recipe/RecipeForm';

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

const httpLinks = createHttpLink({
	uri: `${process.env.REACT_APP_GRAPHQL_API}`
});

const authLink = setContext((_, { headers }) => {

	// get the authentication token from local storage if it exists
  
	const token = localStorage.getItem('token');
  
	// return the headers to the context so httpLink can read them
  
	return {
  
		headers: {
  
			...headers,
  
			authorization: token ? `${token}` : '',
  
		}
  
	};
  
});

const client = new ApolloClient({
	link: authLink.concat(httpLinks),
	cache: new InMemoryCache(),
	// headers: {
	// 	authorization: localStorage.getItem('token') || '',
	// }
});

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
							<PrivateRoute exact path='/recipes/create'>
								<RecipeForm />
							</PrivateRoute>
							<PrivateRoute exact path='/recipes/:id/edit'>
								<RecipeForm />
							</PrivateRoute>
							<Route exact path='/recipes/:id' component={RecipeDetail } />
							<Route exact path='/profile-detail' component={ProfileDetail} />
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
