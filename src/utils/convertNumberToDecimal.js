export const convertNumberToDecimal = (num) => {
	let result = '';		
	let numReverse = num?.toString().split('').reverse().join('');
	for(var i = 0; i < numReverse?.length; i++) 
		if(i%3 == 0) result += numReverse?.substr(i,3)+',';
	return result.split('',result.length-1).reverse().join('');
};