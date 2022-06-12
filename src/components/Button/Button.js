/* eslint-disable react/prop-types */
import React from 'react';
import './style.css';

const PrimaryButton = (props) => {
	return (
		<button className='btn primary'>{props.title}</button>
	);
};

const DefaultButton = (props) => {
	return(
		<button onClick={props.handlingEvents} className='btn default'>{props.title}</button>
	);
};

export {PrimaryButton, DefaultButton};