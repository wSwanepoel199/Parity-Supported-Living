import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
// import { fetchStoredToken } from './shared/utils/authToken';
// import { refreshUser, } from './shared/redux/user/userSlice';
import Posts from './components/Posts';
import { useIndexGetQuery } from './shared/utils/api';

function App() {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { data, error, isLoading } = useIndexGetQuery();

  // useEffect(() => {
  //   if (fetchStoredToken() && Object.keys(userState.user).length === 0) dispatch(refreshUser());
  // }, [dispatch]);

  return (
    <div className='w-screen h-screen bg-slate-400 flex justify-center content-center items-center'>
      <Routes>
        {console.log(data, error, isLoading)}
        <Route path="/" element={userState.authToken ? <Landing /> : <SignIn />}>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<Posts />} />
        </Route>
      </Routes>
    </div>
  );
}


export default App;
