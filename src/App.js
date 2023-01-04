import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { fetchStoredTokenLocal, fetchStoredTokenSession } from './shared/utils/authToken';
import { useRefreshUserMutation, } from './shared/redux/user/userSlice';
import Posts from './components/Posts';

function App() {
  const userState = useSelector(state => state.user);
  const [refreshUser, { data, isLoading, isUninitialized }] = useRefreshUserMutation();

  useEffect(() => {
    console.log(userState.status === "loggedOut");
    if (userState.status === "loggedOut" && (fetchStoredTokenLocal() || fetchStoredTokenSession())) refreshUser();
  }, [userState.status, refreshUser]);

  return (
    <div className='w-screen h-screen bg-slate-400 flex justify-center content-center items-center'>
      <Routes>
        {console.log(data, isLoading, isUninitialized, process.env.NODE_ENV)}
        <Route path="/" element={userState.authToken ? <Landing /> : <SignIn />}>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<Posts />} />
        </Route>
      </Routes>
    </div>
  );
}


export default App;
