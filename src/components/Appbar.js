import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import { useNavigate } from "react-router-dom";
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
    svg: ''
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
    if (userState.status === "loggedIn" && mounted.current) {
      (async () => {
        const avatar = await createAvatar(identicon, {
          seed: userState.user.userId,
        }).toDataUri();

        setAnchorEl(prev => {
          return {
            ...prev,
            svg: avatar
          };
        });
      })();
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
        <Container maxWidth="xl" disableGutters={smallScreen ? true : false}>
          <Toolbar disableGutters className={`flex justify-between`}>
            <Box className={`flex w-full justify-start`}>
              <IconButton
                size={smallScreen ? "small" : "large"}
                name="nav"
                aria-label="appbar-menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                color="inherit"
              >
                <MenuIcon fontSize={smallScreen ? undefined : "inherit"} />
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
            <Box className={`flex w-full  justify-center items-center`}>
              <Box
                component={`img`}
                className={`object-contain  ${smallScreen ? 'max-h-[52px]' : 'max-h-[60px]'} rounded-[4px]`}
                alt="Parity Supported Living"
                src={`${process.env.PUBLIC_URL}/PSLPineapple512.png`}
              />
              {!smallScreen ?
                <Typography
                  variant={smallScreen ? "h6" : "h5"}
                  noWrap
                  component="a"
                  className={`flex text-inherit ${smallScreen ? 'text-[5vw]' : null}`}
                >
                  PARITY SUPPORTED LIVING
                </Typography> : null}
            </Box>
            <Box className={`flex w-full justify-end`}>
              <Box className={`flex justify-center content-center text-center `}>
                <Typography variant="body1" component="a" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1 }}>{userState.user.name}</Typography>
                <IconButton size={smallScreen ? "small" : "large"} name="user" onClick={handleOpenMenu}>
                  {userState.status === "loggedIn" ? <Avatar alt="avatar icon" src={anchorEl.svg} className={`w-[${window.innerWidth / 10}px] h-[${window.innerWidth / 10}px]`} /> : null}
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
        </Container> : null}
    </AppBar >
  );
};

export default Appbar;