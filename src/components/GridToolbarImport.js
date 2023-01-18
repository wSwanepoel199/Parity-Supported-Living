import { Button } from "@mui/material";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useEffect, useRef, useState } from "react";
import { useUploadUsersMutation } from "../shared/redux/api/backendApi";

const GridToolbarImport = ({ type }) => {
  const inputRef = useRef(null);
  const [uploadUsers] = useUploadUsersMutation();

  const [upload, setUpload] = useState({
    color: 'primary',
    text: 'UPLOAD',
    type: type,
    file: null
  });

  useEffect(() => {
    if (upload.file) {
      uploadUsers(upload);
      setUpload(prev => {
        return {
          ...prev,
          file: null
        };
      });
    }
  }, [upload, uploadUsers, inputRef]);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (!e.target.files) {
      return;
    }
    if (e.target.files[0]) {
      setUpload(prev => {
        // if (e.target.files[0].type !== "application/json") {
        //   return {
        //     ...prev,
        //     color: 'error',
        //     text: 'JSON ONLY'
        //   };
        // } else {
        return {
          ...prev,
          color: 'primary',
          file: e.target.files[0]
        };
        // }
      });
      return;
    }
  };

  return (
    <>
      <Button size="small" startIcon={<FileUploadOutlinedIcon />} onClick={handleUpload} color={upload.color}>
        {upload.file ? `${upload.file.name}` : upload.text}
      </Button>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className={`hidden`}
      >

      </input>
    </>
  );
};

export default GridToolbarImport;