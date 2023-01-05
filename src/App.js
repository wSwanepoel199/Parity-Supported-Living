import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { fetchStoredTokenLocal, fetchStoredTokenSession } from './shared/utils/authToken';
import { useRefreshUserMutation, } from './shared/redux/user/userSlice';
import Posts from './components/post/Posts';
import Users from './components/user/Users';
import ProtectedRoute from './shared/utils/ProtectedRoute';

function App() {
  const userState = useSelector(state => state.user);
  const [refreshUser, { data, isLoading, isUninitialized }] = useRefreshUserMutation();

  useEffect(() => {
    console.log(userState.status === "loggedOut");
    if (userState.status === "loggedOut" && (fetchStoredTokenLocal() || fetchStoredTokenSession())) refreshUser();
  }, [userState.status, refreshUser]);

  return (
    <div className='w-screen min-h-screen bg-slate-400 flex justify-center content-center items-center'>
      <Routes>
        {console.log(data, isLoading, isUninitialized, process.env.NODE_ENV)}
        <Route path="/" element={userState.authToken ? <Landing /> : <SignIn />}>
          <Route index element={
            <Posts />
            // <Dashboard />
          } />
          {/* <Route path="notes" element={<Posts />} /> */}
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </div>
  );
}


export default App;
