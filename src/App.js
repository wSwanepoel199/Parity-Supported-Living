import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { fetchStoredToken } from './shared/utils/authToken';
import api from './shared/utils/api';
import { refreshUser, saveToken, saveUser } from './shared/redux/user/userSlice';

function App() {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStoredToken()) dispatch(refreshUser());
  }, [dispatch]);

  return (
    <div className='w-screen h-screen bg-slate-400 flex justify-center content-center items-center'>
      <Routes>
        <Route path="/" element={userState.authToken ? <Landing /> : <SignIn />}>
          <Route index element={<Dashboard />} />
          <Route path="casenotes" element={<div>Hi there</div>} />
        </Route>
      </Routes>
    </div>
  );
}


export default App;
