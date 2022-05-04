/* eslint-disable react/prop-types */
import React from 'react';
import { Skeleton } from '@mui/material';

const Loading = ({children}) => {
	return(
		<>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<div style={{paddingBottom: 10}}>
					<div>
						<Skeleton variant='rectangular' width={130} height={100}>{children}</Skeleton>
						<Skeleton sx={{marginRight:2}} width={130} height={25}>{children}</Skeleton>
					</div>
					<Skeleton width={140} height={30}>{children}</Skeleton>
				</div>
				<div style={{paddingBottom: 10}}>
					<div>
						<Skeleton variant='rectangular' width={130} height={100}>{children}</Skeleton>
						<Skeleton sx={{marginRight:2}} width={130} height={25}>{children}</Skeleton>
					</div>
					<Skeleton width={140} height={30}>{children}</Skeleton>
				</div>
			</div>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<div style={{paddingBottom: 10}}>
					<div>
						<Skeleton variant='rectangular' width={130} height={100}>{children}</Skeleton>
						<Skeleton sx={{marginRight:2}} width={130} height={25}>{children}</Skeleton>
					</div>
					<Skeleton width={140} height={30}>{children}</Skeleton>
				</div>
				<div style={{paddingBottom: 10}}>
					<div>
						<Skeleton variant='rectangular' width={130} height={100}>{children}</Skeleton>
						<Skeleton sx={{marginRight:2}} width={130} height={25}>{children}</Skeleton>
					</div>
					<Skeleton width={140} height={30}>{children}</Skeleton>
				</div>
			</div>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<div style={{paddingBottom: 10}}>
					<div>
						<Skeleton variant='rectangular' width={130} height={100}>{children}</Skeleton>
						<Skeleton sx={{marginRight:2}} width={130} height={25}>{children}</Skeleton>
					</div>
					<Skeleton width={140} height={30}>{children}</Skeleton>
				</div>
				<div style={{paddingBottom: 10}}>
					<div>
						<Skeleton variant='rectangular' width={130} height={100}>{children}</Skeleton>
						<Skeleton sx={{marginRight:2}} width={130} height={25}>{children}</Skeleton>
					</div>
					<Skeleton width={140} height={30}>{children}</Skeleton>
				</div>
			</div>
		</>
	);
};

const LoadingDetailPage = ({children}) => {
	return(
		<>
			<div style={{borderRadius:9, width: 300}}>
				<div style={{paddingBottom: 10}}>
					<div>
						<Skeleton variant='rectangular' width={300} height={200}>{children}</Skeleton>
						<Skeleton sx={{marginRight:2}} width={130} height={25}>{children}</Skeleton>
					</div>
					<Skeleton width={140} height={30}>{children}</Skeleton>
					<Skeleton width={300} height={15}>{children}</Skeleton>
					<Skeleton width={130} height={25}>{children}</Skeleton>
					<Skeleton width={130} height={25}>{children}</Skeleton>
					<Skeleton width={300} height={15}>{children}</Skeleton>
					<Skeleton width={130} height={25}>{children}</Skeleton>
					<Skeleton width={130} height={25}>{children}</Skeleton>
					<Skeleton width={130} height={25}>{children}</Skeleton>
				</div>
			</div>
		</>	
	);
};

export {Loading, LoadingDetailPage};