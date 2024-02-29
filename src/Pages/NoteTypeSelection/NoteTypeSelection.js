import { Container, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddHomeOutlined, DomainOutlined } from '@mui/icons-material';

const NoteTypeSelection = () => {

  let communityNotes = useRef();
  let silNotes = useRef();
  const navigate = useNavigate();
  let [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    console.log(communityNotes.current.getBoundingClientRect().width - 4 - 32, silNotes.current.getBoundingClientRect().width - 4 - 32);
    setMaxWidth(Math.max(communityNotes.current.getBoundingClientRect().width, silNotes.current.getBoundingClientRect().width) - 32);
    console.log(maxWidth);
  }, [maxWidth]);

  return (
    <Container
      className={`h-full w-full max-w-2xl flex flex-col md:flex-row justify-center md:justify-around items-center`}
    >
      <div
        className={`text-psl-primary dark:text-psl-secondary-text hover:text-psl-active-link hover:dark:text-psl-active-link w-full max-w-xs p-4 m-2`}
        id={`community-notes`}
        ref={communityNotes}
        style={{ 'height': `${maxWidth}px` }}
        onClick={() => {
          navigate('notes');
        }}
      // onMouseEnter={() => {
      //   communityNotes.current.className = `border-b-psl-active-link w-full max-w-xs p-4 m-2`;
      // }}
      // onMouseLeave={()=>{
      //   communityNotes.current.className = `text-psl-primary dark:text-psl-secondary-text w-full max-w-xs p-4 m-2`;
      // }}
      >
        <div className={`h-full flex flex-col justify-center items-center rounded-md bg-gradient-to-t md:bg-gradient-to-b from-transparent from-5% to-psl-secondary-text dark:to-psl-primary-text shadow-md`}>
          <DomainOutlined className={`w-full h-1/4 p-2`} />
          <Typography >Community Notes</Typography>
          {/* <Link to="community-notes">Community Notes</Link> */}
        </div>
      </div>
      <div
        className={`text-psl-primary dark:text-psl-secondary-text hover:text-psl-active-link hover:dark:text-psl-active-link w-full max-w-xs p-4 m-2`}
        id={`sil-notes`}
        ref={silNotes}
        style={{ 'height': `${maxWidth}px` }}
        onClick={() => {
          navigate('sil-notes');
        }}
      >
        <div className={`h-full flex flex-col justify-center items-center rounded-md bg-gradient-to-b from-transparent from-5% to-psl-secondary-text dark:to-psl-primary-text shadow-md`}>

          <AddHomeOutlined className={`w-full h-1/4 p-2`} />
          <Typography >
            SIL Notes
          </Typography>
        </div>
      </div>
    </Container>
  );
};

export default NoteTypeSelection;