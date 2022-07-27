import { isDate, parse } from 'date-fns';

export const parseDateString = (value, originalvalue) => {
	const parsedDate = isDate(originalvalue)
    ? originalvalue
    : parse(originalvalue, 'yyyy-MM-dd', new Date());

	return parsedDate;
};