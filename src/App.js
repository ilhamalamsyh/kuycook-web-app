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

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from
} from '@apollo/client';

import {onError} from '@apollo/client/link/error';
import RecipeDetail from './pages/recipe/RecipeDetail';
import About from './pages/about/About';

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

const PrivateRoute = ({children, ...rest}) => {
	return (
		<Route
			{...rest}
			render={() => {
				if(isAuth){
					return children;
				}else{
					return <Redirect to='/recipes'/>;
				}
			}}
		/>
	);
};

const App = () => {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<Header/>
				<div className="app">
					<Container>
						<Switch>
							<Route exact path='/' component={Home} />
							<Route exact path='/recipes' component={Recipe} />
							<Route exact path='/recipes/:id' component={RecipeDetail } />
							{/* <Route path='/account' component={Account} />
							<Route path='/about' component={About} /> */}
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
