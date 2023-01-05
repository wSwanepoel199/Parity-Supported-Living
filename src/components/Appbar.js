import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../shared/redux/user/userSlice";

const Appbar = () => {
  const userState = useSelector(state => state.user);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    <AppBar position="sticky" elevation={0} className={`bg-slate-500`}>
      <Container maxWidth="xl" disableGutters={smallScreen ? true : false}>
        <Toolbar disableGutters className={`flex justify-between`}>
          <Box className={`grow-1 flex`}>
            <IconButton
              size={smallScreen ? "small" : "large"}
              name="nav"
              aria-label="appbar-menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenMenu}
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
              <MenuItem onClick={() => navigate(`/`)}>
                <Typography textAlign="center">Notes</Typography>
              </MenuItem>
              {userState.user.role === "Admin" ? <MenuItem onClick={() => navigate(`/users`)}>
                <Typography textAlign="center">Users</Typography>
              </MenuItem> : null}
            </Menu>
          </Box>
          <Box className={`grow-1`}>
            <Typography
              variant={smallScreen ? "h6" : "h5"}
              noWrap
              component="a"
              className={`flex grow-1 text-inherit ${smallScreen ? 'text-[5vw]' : null}`}
            >
              PARITY SUPPORTED LIVING
            </Typography>
          </Box>
          <Box className={`grow-1`}>
            <Box className={`flex justify-center content-center text-center `}>
              <Typography variant="body1" component="a" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1 }}>{userState.user.name}</Typography>
              <IconButton size={smallScreen ? "small" : "large"} name="user" onClick={handleOpenMenu}>
                {userState.status === "loggedIn" ? <Avatar alt="avatar icon" src={`https://avatars.dicebear.com/api/identicon/${userState.user.userId}.svg`} /> : null}
              </IconButton>
            </Box>
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
    </AppBar >
  );
};

export default Appbar;