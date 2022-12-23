import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { fetchStoredToken } from './shared/utils/authToken';
import { useRefreshUserQuery, } from './shared/redux/user/userSlice';
import Posts from './components/Posts';

function App() {
  const userState = useSelector(state => state.user);
  const [skip, setSkip] = useState(true);
  const { data, isLoading, isUninitialized } = useRefreshUserQuery(undefined, { skip: skip });

  useEffect(() => {
    console.log(userState.status === "loggedOut");
    if (fetchStoredToken() && userState.status === "loggedOut" && isUninitialized) setSkip((prev) => !prev);
  }, [userState.status, isUninitialized]);

  return (
    <div className='w-screen h-screen bg-slate-400 flex justify-center content-center items-center'>
      <Routes>
        {console.log(data, isLoading, isUninitialized)}
        <Route path="/" element={userState.authToken ? <Landing /> : <SignIn />}>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<Posts />} />
        </Route>
      </Routes>
    </div>
  );
}


export default App;
