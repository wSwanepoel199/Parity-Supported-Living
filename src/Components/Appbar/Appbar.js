import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../Redux/user/userApiSlice";

const Appbar = () => {
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
    if (navigate) {
      setAnchorEl(prev => {
        return {
          ...prev,
          nav: null,
          user: null
        };
      });
    }
  }, [userState, navigate]);

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
    <AppBar position="sticky" elevation={0} className={`bg-transparent bg-gradient-to-b from-psl-secondary to-transparent z-10 dark:from-psl-secondary`}>
      <Container maxWidth="lg" name="appbar-container">
        <Toolbar disableGutters className={`flex justify-between`} name="appbar-segmentor">
          <Box className={`flex w-full justify-start ${userState.status === "loggedIn" ? "" : "hidden"}`} name="appbar-nav-menu">
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
              MenuListProps={{
                className: 'dark:bg-slate-800'
              }}
            >
              <MenuItem component={Link} to="/notes" href="/notes">
                <Typography textAlign="center" className={`dark:text-white`}>Notes</Typography>
              </MenuItem>
              <MenuItem component={Link} to="/clients" href="/clients">
                <Typography textAlign="center" className={`dark:text-white`}>Clients</Typography>
              </MenuItem>
              {["Admin", "Coordinator"].includes(userState.user.role) ? <MenuItem component={Link} to="/users" href="/users">
                <Typography textAlign="center" className={`dark:text-white`}>Users</Typography>
              </MenuItem> : null}
            </Menu>
          </Box>
          <Box className={`flex w-full  justify-center items-center`} name="appbar-logo">
            {!smallScreen ?
              <Typography
                variant="h5"
                noWrap
                component="a"
                className={`flex text-psl-primary dark:text-psl-secondary-text drop-shadow-md`}
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
          <Box className={`flex w-full justify-end ${userState.status === "loggedIn" ? "" : "hidden"}`}>
            <Box className={`flex justify-center content-center text-center `}>
              <Typography
                variant="body1"
                component="p"
                sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1 }}
                className={`drop-shadow-lg`}
              >{userState.user.name}</Typography>
              <IconButton
                size={smallScreen ? "small" : "large"}
                name="user"
                onClick={handleOpenMenu}
                className={``}>
                {userState.status === "loggedIn" ?
                  <Avatar
                    alt="avatar icon"
                    src={userState.icon ? userState.icon.icon : ''}
                    className={`w-[${window.innerWidth / 10}px] h-[${window.innerWidth / 10}px] ring-1 ring-psl-secondary`} /> : null}
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
              MenuListProps={{
                className: 'dark:bg-slate-800'
              }}
            >
              <MenuItem onClick={() => {
                handleCloseMenu('user');
                logoutUser(userState.user.userId);
              }}>
                <Typography textAlign="center" className={`dark:text-white`}>SignOut</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default memo(Appbar);