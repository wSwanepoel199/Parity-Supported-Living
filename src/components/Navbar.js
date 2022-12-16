import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../shared/redux/user/userSlice";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
// import api from "../shared/utils/api";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const signOut = () => {
    // api('get', '/auth/logout')
    //   .then(dispatch(removeUser()));
  };

  return (
    <Box className="bg-neutral-500 h-screen max-h-full w-1/6 min-w-min flex flex-col justify-between">
      <List disablePadding>
        <ListItem>
          <ListItemText primary={user.name} />
        </ListItem>
        <ListItemButton component={RouterLink} to="/">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/notes">
          <ListItemText primary="Notes" />
        </ListItemButton>
      </List>
      <List disablePadding>
        <Divider />
        <ListItemButton onClick={() => signOut()}>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Navbar;