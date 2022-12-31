export const fetchStoredToken = () => sessionStorage.getItem('accessToken');

export const storeAuthToken = (token) => sessionStorage.setItem('accessToken', token);

export const removeStoredToken = () => sessionStorage.removeItem('accessToken');