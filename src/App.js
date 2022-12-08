import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { fetchStoredToken } from './shared/utils/authToken';
import api from './shared/utils/api';
import { saveToken, saveUser } from './shared/redux/user/userSlice';

function App() {
  const authenticated = useSelector(state => state.user.authToken);
  const dispatch = useDispatch();
  useEffect(() => {
    if (fetchStoredToken()) {
      api('get', '/refresh')
        .then(data => {
          console.log(data);
          dispatch(saveToken(data.accessToken));
          dispatch(saveUser(data));
        })
        .catch(err => console.log(err));
    }
  }, [dispatch]);
  return (
    <div className='w-screen h-screen bg-slate-400 flex justify-center content-center items-center'>
      <Routes>
        <Route path="/" element={authenticated ? <Landing /> : <SignIn />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
