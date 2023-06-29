import { Button } from "@mui/material";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { memo, useEffect, useRef, useState } from "react";
import { useUploadFileMutation } from "../../Redux/api/backendApi";
import { storeError } from "../../Redux/root/rootSlice";
import { sendMessage } from "../../Services/api";
import { read, utils } from "xlsx";
import { useDispatch } from "react-redux";

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

  async function formatFile(file) {
    // if (process.env.NODE_ENV === "development") import('xlsx').then(({ read, utils }) => {
    const f = await (file).arrayBuffer();
    const wb = read(f);
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    return data;
    // })
    //   .catch(err => {
    //     console.error(err);
    //   });
  };

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
            // console.log(err);
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
      <Button
        size="small"
        startIcon={<FileUploadOutlinedIcon />}
        onClick={handleUpload} color={upload.color}
        className={`text-psl-active-link`}
      >
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

export default memo(GridToolbarImport);