/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

export const TextError = (props) => {
	return (
		<div style={{fontSize: '12px',color:'red'}}>{props.message}</div>
	);
};
