// import api from "./api";

export const userMiddleware = state => next => action => {
  if (action.type === 'user/loginUser') {
    console.log(state.getState());
    console.log(next);
    console.log(action);
    // api('post', '/auth/login', { data: action.payload })
    //   .then(res => {
    //     state.dispatch({ type: 'user/saveUser' });
    //   })
    //   .catch(err => console.log(err));
  }

  return next(action);
};