/* eslint-disable react/prop-types */
import React from 'react';
import './style.css';

const PrimaryButton = (props) => {
	return (
		<button className='btn primary'>{props.title}</button>
	);
};

const DangerButton = (props) => {
	return(
		<button className='btn danger'>{props.title}</button>
	);
};

export {PrimaryButton, DangerButton};