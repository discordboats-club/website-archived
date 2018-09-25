export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = token => ({
    type: LOGIN,
    authtoken: token,
    loggedIn: true
});

export const logout = () => ({
    type: LOGOUT,
    authtoken: '',
    loggedIn: false
});