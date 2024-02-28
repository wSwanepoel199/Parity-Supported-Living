import { Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddHomeOutlined, DomainOutlined } from '@mui/icons-material';

const NoteTypeSelection = () => {

  const navigate = useNavigate();


  return (
    <div className={`h-full flex justify-evenly items-center`}>
      <div
        className={`text-white flex flex-col justify-center items-center rounded border-2 border-red-300 border-solid p-4`}
        onClick={() => {
          navigate('notes');
        }}
      >
        <DomainOutlined className={`w-full h-10 p-1`} />
        <Typography >Community Notes</Typography>
        {/* <Link to="community-notes">Community Notes</Link> */}
      </div>
      <div
        className={`text-white flex flex-col justify-center items-center rounded border-2 border-red-300 border-solid p-4`}
        onClick={() => {
          navigate('sil-notes');
        }}>
        <AddHomeOutlined className={`w-full h-10 p-1`} />
        <Typography >
          SIL Notes
        </Typography>
      </div>
    </div>
  );
};

export default NoteTypeSelection;