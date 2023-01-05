import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../shared/redux/user/userSlice";

const Appbar = () => {
  const userState = useSelector(state => state.user);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const [anchorEl, setAnchorEl] = useState({
    nav: null,
    user: null
  });


  const handleOpenMenu = (event) => {
    setAnchorEl(prev => {
      return {
        ...prev,
        [event.currentTarget.name]: event.currentTarget
      };
    });
  };
  const handleCloseMenu = (name) => {
    setAnchorEl(prev => {
      return {
        ...prev,
        [name]: null
      };
    });
  };

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl" className={`bg-slate-500`}>
        <Toolbar disableGutters className={`bg-inherit flex justify-between`}>
          <Box className={`grow-1 flex`}>
            <IconButton
              size="large"
              name="nav"
              aria-label="appbar-menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              // onClick={handleOpenMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              name="nav"
              anchorEl={anchorEl.nav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorEl.nav)}
              onClose={() => handleCloseMenu("nav")}
            >
              {/* <MenuItem onClick={() => navigate(`/notes`)}>
                <Typography textAlign="center">Notes</Typography>
              </MenuItem> */}
            </Menu>
          </Box>
          <Box className={`grow-1`}>
            <Typography
              variant="h5"
              noWrap
              component="a"
              className={`flex grow-1 text-inherit mr-2`}
            >
              PARITY SUPPORTED LIVING
            </Typography>
          </Box>
          <Box className={`grow-0`}>
            <IconButton name="user" onClick={handleOpenMenu}>
              {userState.status === "loggedIn" ? <Avatar alt="avatar icon" src={`https://avatars.dicebear.com/api/identicon/${userState.user.userId}.svg`} /> : null}
            </IconButton>
            <Menu
              id="menu-appbar"
              name="user"
              anchorEl={anchorEl.user}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl.user)}
              onClose={() => handleCloseMenu("user")}
            >
              <MenuItem onClick={logoutUser}>
                <Typography textAlign="center">SignOut</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Appbar;