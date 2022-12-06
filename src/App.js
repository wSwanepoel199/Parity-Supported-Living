import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
// import Template from './pages/Template';
import Landing from './pages/Landing';

function App() {
  // request to back doesn't work
  useEffect(() => {
    fetch('http://192.168.56.101:5000/')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);
  return (
    <div className='w-screen h-screen'>
      <Routes>
        <Route path='/' element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
