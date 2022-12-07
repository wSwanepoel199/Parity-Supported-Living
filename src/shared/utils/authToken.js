export const fetchAuthToken = () => localStorage.getItem('accessToken');

export const storeAuthToken = (token) => localStorage.setItem('accessToken', token);

export const removeStoredToken = () => localStorage.removeItem('accessToken');