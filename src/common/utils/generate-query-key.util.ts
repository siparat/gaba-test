export const generateQueryKey = (query: object): string => {
	return Object.entries(query)
		.toSorted(([key1], [key2]) => (key1.codePointAt(0) || 0) - (key2.codePointAt(0) || 0))
		.map(([key, value]) => `${key}=${value}`)
		.join('&');
};
