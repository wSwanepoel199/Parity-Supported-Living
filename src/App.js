import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './components/SignIn';

function App() {
  const user = useSelector(state => state.user.id);
  return (
    <div className='w-screen h-screen'>
      <Routes>
        <Route path="/" element={<Landing />}>
          <Route index element={user ? <Dashboard /> : <SignIn />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
