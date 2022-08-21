/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from '@firebase/storage';
import { useField } from 'formik';

export const DropZoneImage = ({name}) => {
	const [_, __, helpers] = useField(name);
	// let { setFieldValue, name } = props;
	const [imageUrl, setImageUrl] = useState('');
	const [progressPercent, setProgressPercent] = useState(0);

	useEffect(() => {
		helpers.setValue(imageUrl);
		// helpers.setTouched(true);
	}, [imageUrl]);

	const uploadImageToFirebase = (imageUrl) => {
		const storageRef = ref(storage, `files/${new Date().getTime()}-${imageUrl.name}`);
		const uploadTask = uploadBytesResumable(storageRef, imageUrl);
		
		uploadTask.on('state_changed',
			(snapshot) => {
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				setProgressPercent(progress);
			}, 
			(error) => {
				alert(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImageUrl(downloadURL);
				});
			});
	};

	const onDrop = useCallback(acceptedFiles => {
		const file = acceptedFiles[0];
		if(!file) return;

		setImageUrl(Object.assign(file,{
			preview: URL.createObjectURL(file)
		}));
		uploadImageToFirebase(file);
	}, []);

	// const onDrop = useCallback(acceptedFiles => {

	// 	const file = acceptedFiles[0];
	// 	if(!file) return;
		
	// 	const storageRef = ref(storage, `files/${new Date().getTime()}-${file.name}`);
	// 	const uploadTask = uploadBytesResumable(storageRef, file);

	// 	uploadTask.on('state_changed',
	// 		(snapshot) => {
	// 			const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
	// 			setProgressPercent(progress);
	// 		}, 
	// 		(error) => {
	// 			alert(error);
	// 		},
	// 		() => {
	// 			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
	// 				setImageUrl(downloadURL);
	// 			});
	// 		});
	// 	setFieldValue('gambar',imageUrl);
	// }, []);

	const {getRootProps, getInputProps} = useDropzone({onDrop, multiple: false , accept: {
		'image/*': ['.jpeg', '.png']
	}});

	return (
		<React.Fragment>
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<p>Drag & drop some images here, or click to select files</p>
			</div>
			{/* {
				!imageUrl &&
	<div className='outerbar'>
		<div className='innerbar' style={{ width: `${progressPercent}%` }}>{progressPercent}%</div>
	 </div>
			} */}
			{
				imageUrl &&
	<img src={imageUrl.preview} alt='uploaded file' style={{height: 200, width: 200}} />
			}
			{/* <button onClick={uploadImageToFirebase}>Upload</button> */}
		</React.Fragment>
	);
};