import React from 'react';
import "./App.css";
import { Outlet } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { FiSettings } from 'react-icons/fi';

import { Sidebar, Navbar } from './components';


const App = () => {
  const activeMenu = true;
  console.log(this);

  return (
    <div>
      <div className={`flex relative dark:bg-main-dark-bg`}>
        <div className={`fixed right-4 bottom-4 z-[1000]`}>
          <TooltipComponent
            content="Settings"
            position='TopCenter'>
            <button
              type="button"
              className={`text-3xl p-3 hover:drop-shadow-lx hover:bg-light-gray text-white`}
              style={{ background: 'blue', borderRadius: '50%' }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        <div className={`${activeMenu ? `w-72 fixed sidebar bg-white` : `w-0`} dark:bg-secondary-dark-bg`}>
          <Sidebar />
        </div>
        <div className={`dark:bg-main-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
          <div className={`fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full`}>
            <Navbar />
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};


export default App;