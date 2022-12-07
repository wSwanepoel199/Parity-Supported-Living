import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
// import Template from './pages/Template';
import SignIn from './pages/SignIn';
import api from './shared/utils/api';

function App() {
  // request to back doesn't work
  useEffect(() => {
    api('get', '/')
      .then(data => console.log(data))
      .catch(err => console.log(err));
    // fetch(`${process.env.REACT_APP_API_URL}/`)
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    //   .catch(err => console.error(err));
  }, []);
  return (
    <div className='w-screen h-screen'>
      <Routes>
        <Route path='/' element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
