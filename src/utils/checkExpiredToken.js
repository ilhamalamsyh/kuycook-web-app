export const checkExpiredToken = (token, dispatch, history) => {
	if (token === null || token === undefined) {
		dispatch({ type: 'LOGIN_FAILURE' });
		history.push('/login');
	}
};