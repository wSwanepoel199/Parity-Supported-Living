import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../shared/redux/user/userSlice";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const user = useSelector(state => state.user.user);
  const [logoutUser] = useLogoutUserMutation();

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
        <ListItemButton onClick={() => logoutUser()}>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Navbar;