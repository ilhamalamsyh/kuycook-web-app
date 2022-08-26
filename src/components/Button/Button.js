/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';
import './style.css';



const PrimaryButtonNative = (props) => {
	let history = useHistory();
	return (
		<button onClick={() => {history.push(props.href);}} className='btn default'>{props.title}</button>
	);
};

const DefaultButton = (props) => {
	return(
		<button onClick={props.handlingEvents} className='btn danger'>{props.title}</button>
	);
};

export {PrimaryButtonNative, DefaultButton};