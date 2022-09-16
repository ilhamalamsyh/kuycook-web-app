/* eslint-disable no-undef */
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_COVID_19_API}`;

const HEADERS = {
	'X-RapidAPI-Key': `${process.env.REACT_APP_COVID_19_API_HEADERS_X_RAPIDAPI_KEY}`,
	'X-RapidAPI-Host': `${process.env.REACT_APP_COVID_19_API_HEADERS_X_RAPIDAPI_HOST}`
};



const getIndonesianCovid19Data = async() => {
	try {
		const response = await axios.get(API_URL,{
			headers: HEADERS
		});
		return response.data[0];
	} catch (error) {
		throw Error(error);
	}
};

export { getIndonesianCovid19Data }; 
