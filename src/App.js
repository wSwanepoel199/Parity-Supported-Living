import React, { useEffect, useState, useTransition } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './components/SignIn';
import api from './shared/utils/api';
import { fetchAuthToken } from './shared/utils/authToken';

function App() {
  // TODO Impliment redux for state management
  return (
    <div className='w-screen h-screen'>
      <Routes>
        <Route path="/" element={<Landing />}>
          <Route index element={fetchAuthToken() ? <Dashboard /> : <SignIn />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
