/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';
import './style.css';



const PrimaryButton = (props) => {
	let history = useHistory();
	return (
		<button onClick={() => {history.push(props.href);}} className='btn primary'>{props.title}</button>
	);
};

const DefaultButton = (props) => {
	return(
		<button onClick={props.handlingEvents} className='btn default'>{props.title}</button>
	);
};

export {PrimaryButton, DefaultButton};