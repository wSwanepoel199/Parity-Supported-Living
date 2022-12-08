import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../shared/redux/user/userSlice";
import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import api from "../shared/utils/api";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const signOut = () => {
    api('get', '/auth/logout')
      .then(dispatch(removeUser()));
  };

  return (
    <Box className="bg-neutral-500 h-screen w-1/6 min-w-min flex flex-col">
      <List disablePadding>
        <ListItem>
          <ListItemText primary={user.name} />
        </ListItem>
        <ListItemButton component={RouterLink} to="/signin">
          <ListItemText primary="TestLink" />
        </ListItemButton>
        <ListItemButton onClick={() => signOut()}>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </List>
    </Box>
  );
};

// <Box className="h-14">
// <Typography >{user.name}</Typography>
// </Box>
// <Button variant="contained" onClick={() => signOut()} className="self-end">SignOut</Button>

export default Navbar;