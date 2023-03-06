import { Button } from "@mui/material";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useEffect, useRef, useState } from "react";
import { useUploadFileMutation } from "../shared/redux/api/backendApi";
import { sendMessage } from "../shared/utils/api";
import { read, utils } from "xlsx";
import { useDispatch } from "react-redux";
import { storeError } from "../shared/redux/root/rootSlice";

const GridToolbarImport = ({ type }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [uploadFile] = useUploadFileMutation();

  const [upload, setUpload] = useState({
    color: 'primary',
    text: 'UPLOAD',
    type: type,
    file: null
  });

  useEffect(() => {
    if (upload.file) {
      if (process.env.NODE_ENV === "production") {
        sendMessage({ type: 'import', data: upload.file })
          .then(res => uploadFile({ data: res, type: upload.type }))
          .catch(err => {
            console.error(err);
            dispatch(storeError({ status: 422, statusText: 'UnprocessableEntity', message: err.message }));
          });
      } else {
        formatFile(upload.file)
          .then(res => uploadFile({ data: res, type: upload.type }))
          .catch(err => {
            console.error(err);
            console.log(err);
            dispatch(storeError({ status: 422, statusText: 'UnprocessableEntity', message: err.message }));
          });
      }
      setUpload(prev => {
        return {
          ...prev,
          file: null
        };
      });
    }
  }, [upload, uploadFile, inputRef, dispatch]);

  const formatFile = async (file) => {
    const f = await (file).arrayBuffer();
    const wb = read(f);
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    return data;
  };

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (!e.target.files) {
      return;
    }
    if (e.target.files[0]) {
      setUpload(prev => {
        return {
          ...prev,
          color: 'primary',
          text: 'UPLOAD',
          file: e.target.files[0]
        };
      });
      e.target.value = null;
      return;
    };
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