import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../shared/redux/user/userSlice";

const Appbar = () => {
  const mounted = useRef();
  const userState = useSelector(state => state.user);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState({
    nav: null,
    user: null,
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
    if (navigate) {
      setAnchorEl(prev => {
        return {
          ...prev,
          nav: null,
          user: null
        };
      });
    }
    return () => {
      mounted.current = false;
    };
  }, [mounted, userState, navigate]);

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
    <AppBar position="sticky" elevation={0} className={`bg-slate-500 z-10`}>
      {mounted.current ?
        <Container maxWidth="xl" >
          <Toolbar disableGutters className={`flex justify-between`}>
            <Box className={`flex w-full justify-start`}>
              <IconButton
                size="large"
                name="nav"
                aria-label="appbar-menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                color="inherit"
              >
                <MenuIcon fontSize={"inherit"} />
              </IconButton>
              <Menu
                id="nav-menu-appbar"
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
                aria-label="nav menu button"
              >
                <MenuItem component={Link} to="/" href="/">
                  <Typography textAlign="center">Notes</Typography>
                </MenuItem>
                {["Admin", "Coordinator"].includes(userState.user.role) ? <MenuItem component={Link} to="/users" href="/users">
                  <Typography textAlign="center">Users</Typography>
                </MenuItem> : null}
              </Menu>
            </Box>
            <Box className={`flex w-full  justify-center items-center`}>
              {!smallScreen ?
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  className={`flex text-inherit `}
                >
                  PARITY SUPPORTED LIVING
                </Typography> :
                <Box
                  component={`img`}
                  className={`object-contain  ${smallScreen ? 'h-[52px] w-[52px]' : 'h-[60px] w-[60px]'} rounded-[4px]`}
                  alt="Parity Supported Living"
                  src={`${process.env.PUBLIC_URL}/PSLPineapple512.png`}
                />}
            </Box>
            <Box className={`flex w-full justify-end`}>
              <Box className={`flex justify-center content-center text-center `}>
                <Typography variant="body1" component="p" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1 }}>{userState.user.name}</Typography>
                <IconButton size={smallScreen ? "small" : "large"} name="user" onClick={handleOpenMenu} className={``}>
                  {userState.status === "loggedIn" ? <Avatar alt="avatar icon" src={userState.user.icon ? userState.user.icon.icon : ''} className={`w-[${window.innerWidth / 10}px] h-[${window.innerWidth / 10}px] bg-white ring-1 ring-white`} /> : null}
                </IconButton>
              </Box>
              <Menu
                id="user-menu-appbar"
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
                aria-label="user menu button"
              >
                <MenuItem onClick={logoutUser}>
                  <Typography textAlign="center">SignOut</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container> : null}
    </AppBar>
  );
};

export default Appbar;