/* eslint-disable react/prop-types */
import React from 'react';

let UserStateContext = React.createContext();
let UserDispatchContext = React.createContext();

const userReducer = (state, action) => {
	switch(action.type){
	case 'LOGIN_SUCCESS':
		return {...state, isAuthenticated: true};
	case 'LOGOUT_SUCCESS':
		return {...state, isAuthenticated: false};
	case 'LOGIN_FAILURE':
		return{...state, isAuthenticated: false};
	case 'REGISTER_SUCCESS':
		return {...state, isAuthenticated: true};
	case 'REGISTER_FAILURE':
		return {...state, isAuthenticated: false};
	default: {
		throw new Error(`Unhandled action type: ${action.type}`);
	}		
	}
};

const UserProvider = ({children}) =>{
	let[state, dispatch] = React.useReducer(userReducer, {
		isAuthenticated: !!localStorage.getItem('user'),
	});

	return(
		<UserStateContext.Provider value={state}>
			<UserDispatchContext.Provider value={dispatch}>
				{children}
			</UserDispatchContext.Provider>
		</UserStateContext.Provider>
	);
};

const useUserState = () => {
	let context = React.useContext(UserStateContext);
	if (context === undefined) {
		throw new Error('useUserState must be used within a UserProvider');
	}
	return context;
};

const useUserDispatch = () => {
	let context  = React.useContext(UserDispatchContext);
	if(context === undefined){
		throw new Error('useUserDispatch must be used within a UserProvider');
	}
	return context;
};

export {UserProvider, useUserDispatch, useUserState};