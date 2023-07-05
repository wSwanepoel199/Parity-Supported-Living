import { Collapse, Alert, IconButton, AlertTitle } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, selectRoot } from "../Redux/root/rootSlice";
import { memo, useEffect, useState } from "react";

const CustomAlert = () => {
  const root = useSelector(selectRoot);
  const dispatch = useDispatch();

  const [alert, setAlert] = useState(undefined);

  useEffect(() => {
    if (['error'].includes(root.status) && root.status !== "loading") {
      setAlert(prev => {
        return {
          ...prev,
          ...root
        };
      });
    }
    // if (['error'].includes(state.root.status) && state.root.msg.status === 403) {
    //   refreshUser();
    // }
  }, [root]);

  return (
    <Collapse
      in={['error'].includes(root.status)}
      unmountOnExit
      className={`fixed z-50 left-0 top-0 w-full`}
    >
      {alert ?
        <Alert
          className={`flex items-center`}
          severity={alert.status}
          action={
            <IconButton
              aria-label="close"
              color='inherit'
              onClick={() => {
                dispatch(clearMessage());
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>}

        >
          <AlertTitle>{alert.msg.status} {alert.msg.statusText}</AlertTitle>
          {(alert.msg.message)}
        </Alert>
        : null}
    </Collapse>
  );
};

export default memo(CustomAlert);