/* eslint-disable react/prop-types */
import { InfoOutlined } from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import '../styles/covid19.css';

export const Covid19InfoSection = ({totalConfirmed, totalDeaths, totalRecovered, newCases}) => {
	return (
		<Card
			style={{
				borderRadius: '8px',
				boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
				backdropFilter: 'blur(6.4px)',
				border: '1px solid rgba(255, 255, 255, 0.21)',
				marginBottom: 20.0,
			}}
		>
			<CardContent>
				<Grid container spacing={1}>
					<InfoOutlined fontSize='small' style={{
						color: '#4ab4fe'
					}}/>
					<Typography variant='subtitle2' style={{
						marginBottom: 10,
						fontWeight: 'bold',
						marginLeft: 5.0
					}}>
					Indonesia Covid 19 Info
					</Typography>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<div className='confirmed'>
							<div style={{
								textAlign: 'center',
							}}>
								<Typography variant='h6' style={{fontWeight: 'bold'}}>{totalConfirmed}</Typography>
								<Typography variant='body2'>Confirmed</Typography>
							</div>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className='death'>
							<div style={{
								textAlign: 'center',
							}}>
								<Typography variant='h6' style={{fontWeight: 'bold'}}>{totalDeaths}</Typography>
								<Typography variant='body2'>Deaths</Typography>
							</div>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className='recovered'>
							<div style={{
								textAlign: 'center',
							}}>
								<Typography variant='h6' style={{fontWeight: 'bold'}}>{totalRecovered}</Typography>
								<Typography variant='body2'>Recovered</Typography>
							</div>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className='new_cases'>
							<div style={{
								textAlign: 'center',
							}}>
								<Typography variant='h6' style={{fontWeight: 'bold'}}>{newCases}</Typography>
								<Typography variant='body2'>New Cases</Typography>
							</div>
						</div>
					</Grid>
				</Grid>
			</CardContent>
			<Typography fontSize={10} variant='subtitle2' style={{
				padding: 5,
				marginRight: 12.0,
				textAlign: 'right',
				color: '#A2B5BB',
				fontWeight: 'bold',
			}}>
					Powered by <a href='https://vaccovid.live/' target='blank'>Vaccovid</a>
			</Typography>
		</Card>
	);
};
