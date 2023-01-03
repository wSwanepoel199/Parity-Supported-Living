export const fetchStoredTokenSession = () => sessionStorage.getItem('accessToken');
export const fetchStoredTokenLocal = () => localStorage.getItem('accessToken');

export const storeAuthTokenSession = (token) => sessionStorage.setItem('accessToken', token);
export const storeAuthTokenLocal = (token) => localStorage.setItem('accessToken', token);

export const removeStoredTokenSession = () => sessionStorage.removeItem('accessToken');
export const removeStoredTokenLocal = () => localStorage.removeItem('accessToken');