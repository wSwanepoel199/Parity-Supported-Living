import { Collapse, Alert, IconButton, AlertTitle } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../redux/root/rootSlice";
import { memo } from "react";

const CustomAlert = ({ alert }) => {
  const rootState = useSelector(state => state.root);
  const dispatch = useDispatch();

  return (
    <Collapse
      in={['error'].includes(rootState.status)}
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