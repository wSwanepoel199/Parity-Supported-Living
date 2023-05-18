import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Sidebar = () => {
  const activeMenu = true;

  return (
    <div className={`ml-3 h-screen overflow-auto md:overflow-hidden md:hover:overflow-auto pb-10`}>
      {activeMenu && (
        <div className={`flex justify-between items-center m-3`}>
          <Link
            to="/"
            onClick={() => { console.log("click!"); }}
            className={`items-center gap-3 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900`}
          >
            <SiShopware /> <span>Shopping</span>
          </Link>
          <TooltipComponent
            content={"Menu"}
            position='BottomCenter'>
            <button
              type="button"
              onClick={() => { }}
              className={`text-xl rounded-full hover:bg-light-gray block md:hidden`}>
              <MdOutlineCancel />
            </button>
          </TooltipComponent>
        </div>
      )}
    </div>
  );
};

export default Sidebar;