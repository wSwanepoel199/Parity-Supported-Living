import { Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NoteTypeSelection = () => {

  const navigate = useNavigate();


  return (
    <div className={`h-full flex justify-around items-center`}>
      <div className={`text-white `}>
        <Typography onClick={() => {
          navigate('notes');
        }}>Community Notes</Typography>
        {/* <Link to="community-notes">Community Notes</Link> */}
      </div>
      <div className={`text-white`}><Link to="sil-notes">SIL Notes</Link></div>
    </div>
  );
};

export default NoteTypeSelection;