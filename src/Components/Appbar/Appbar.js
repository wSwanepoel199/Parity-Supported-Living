import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { memo, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../Redux/user/userApiSlice";
import { selectUser } from "../../Redux/user/userSlice";

const Appbar = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const menu = useRef();

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [hover, setHover] = useState(undefined);

  const [anchorEl, setAnchorEl] = useState({
    nav: null,
    user: null,
  });

  useEffect(() => {
    if (navigate) {
      setAnchorEl((prev) => {
        return {
          ...prev,
          nav: null,
          user: null,
        };
      });
    }
  }, [user, navigate]);

  const handleOpenMenu = (event) => {
    setAnchorEl((prev) => {
      return {
        ...prev,
        [event.currentTarget.name]: event.currentTarget,
      };
    });
  };

  const handleCloseMenu = (name) => {
    setAnchorEl((prev) => {
      return {
        ...prev,
        [name]: null,
      };
    });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={`bg-transparent bg-gradient-to-b from-psl-secondary to-transparent z-10 dark:from-psl-secondary`}
    >
      <Container maxWidth="lg" name="appbar-container">
        <Toolbar
          disableGutters
          className={`flex justify-between`}
          name="appbar-segmentor"
        >
          <Box
            className={`flex w-full justify-start ${user.status === "loggedIn" ? "" : "hidden"
              }`}
            name="appbar-nav-menu"
          >
            <IconButton
              size="large"
              name="nav"
              aria-label="appbar-menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenMenu}
              color="inherit"
            >
              <MenuIcon
                fontSize={"inherit"}
                className={`text-psl-primary dark:text-psl-active-text`}
              />
            </IconButton>
            <Menu
              id="nav-menu-appbar"
              name="nav"
              anchorEl={anchorEl.nav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              disablePortal
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorEl.nav)}
              onClose={() => handleCloseMenu("nav")}
              aria-label="nav menu button"
              PopoverClasses={{
                paper: "bg-inherit",
              }}
              MenuListProps={{
                className: "bg-psl-secondary-text dark:bg-psl-primary",
                onMouseLeave: () => handleCloseMenu("nav"),
              }}
            >
              <MenuItem
                component={Link}
                to="/"
                href="/"
                id="home"
                onMouseEnter={(e) => {
                  menu.current = e;
                  setHover(e);
                }}
                onMouseLeave={() => {
                  menu.current = null;
                  setHover(undefined);
                }}
              >
                <Typography
                  textAlign="center"
                  className={`${hover?.target.id === "home"
                    ? `text-psl-active-link`
                    : `text-psl-primary dark:text-psl-active-text`}`}
                >
                  Home
                </Typography>
              </MenuItem>
              <MenuItem
                component={Link}
                to="/notes"
                href="/notes"
                id="notes"
                onMouseEnter={(e) => {
                  menu.current = e;
                  setHover(e);
                }}
                onMouseLeave={() => {
                  menu.current = null;
                  setHover(undefined);
                }}
              >
                <Typography
                  textAlign="center"
                  className={`${hover?.target.id === "notes"
                    ? `
                  text-psl-active-link`
                    : `
                  text-psl-primary 
                  dark:text-psl-active-text
                  `
                    }`}
                >
                  Notes
                </Typography>
              </MenuItem>
              <MenuItem
                component={Link}
                to="/clients"
                href="/clients"
                id="clients"
                onMouseEnter={(e) => {
                  menu.current = e;
                  setHover(e);
                }}
                onMouseLeave={() => {
                  menu.current = null;
                  setHover(undefined);
                }}
              >
                <Typography
                  textAlign="center"
                  className={`${hover?.target.id === "clients"
                    ? `
                  text-psl-active-link`
                    : `
                  text-psl-primary 
                  dark:text-psl-active-text
                  `
                    }`}
                >
                  Clients
                </Typography>
              </MenuItem>
              {["Admin", "Coordinator"].includes(user.user.role) ? (
                <MenuItem
                  component={Link}
                  to="/users"
                  href="/users"
                  id="users"
                  onMouseEnter={(e) => {
                    menu.current = e;
                    setHover(e);
                  }}
                  onMouseLeave={() => {
                    menu.current = null;
                    setHover(undefined);
                  }}
                >
                  <Typography
                    textAlign="center"
                    className={`${hover?.target.id === "users"
                      ? `
                  text-psl-active-link`
                      : `
                  text-psl-primary 
                  dark:text-psl-active-text
                  `
                      }`}
                  >
                    Users
                  </Typography>
                </MenuItem>
              ) : null}
            </Menu>
          </Box>
          <Box
            className={`flex w-full  justify-center items-center`}
            name="appbar-logo"
          >
            {!smallScreen ? (
              <Typography
                variant="h5"
                noWrap
                component="a"
                className={`flex text-psl-primary dark:text-psl-secondary-text drop-shadow-md`}
              >
                PARITY SUPPORTED LIVING
              </Typography>
            ) : (
              <Box
                component={`img`}
                className={`object-contain  ${smallScreen ? "h-[52px] w-[52px]" : "h-[60px] w-[60px]"
                  } rounded-[4px]`}
                alt="Parity Supported Living"
                src={`${process.env.REACT_APP_PUBLIC_URL}/PSLPineapple512.png`}
              />
            )}
          </Box>
          <Box
            className={`flex w-full justify-end ${user.status === "loggedIn" ? "" : "hidden"
              }`}
          >
            <Box className={`flex justify-center content-center text-center `}>
              <Typography
                variant="body1"
                component="p"
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  mr: 1,
                }}
                className={`drop-shadow-lg text-psl-primary dark:text-psl-active-text`}
              >
                {user.user.name}
              </Typography>
              <IconButton
                size={smallScreen ? "small" : "large"}
                name="user"
                onClick={handleOpenMenu}
                className={``}
              >
                {user.status === "loggedIn" ? (
                  <Avatar
                    alt="avatar icon"
                    src={user.icon ? user.icon.icon : ""}
                    className={`w-[${window.innerWidth / 10}px] h-[${window.innerWidth / 10
                      }px] ring-1 ring-psl-active-text dark:ring-psl-primary bg-psl-active-text dark:bg-psl-primary`}
                  />
                ) : null}
              </IconButton>
            </Box>
            <Menu
              id="user-menu-appbar"
              name="user"
              anchorEl={anchorEl.user}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              disablePortal
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl.user)}
              onClose={() => handleCloseMenu("user")}
              aria-label="user menu button"
              PopoverClasses={{
                paper: "bg-inherit",
              }}
              MenuListProps={{
                className: "bg-psl-secondary-text dark:bg-psl-primary",
                onMouseLeave: () => handleCloseMenu("user"),
              }}
            >
              <MenuItem
                id="signout"
                onClick={() => {
                  handleCloseMenu("user");
                  logoutUser(user.user.userId);
                }}
                onMouseEnter={(e) => {
                  menu.current = e;
                  setHover(e);
                }}
                onMouseLeave={() => {
                  menu.current = null;
                  setHover(undefined);
                }}
              >
                <Typography
                  textAlign="center"
                  className={`${hover?.target.id === "signout"
                    ? `
                  text-psl-active-link`
                    : `
                  text-psl-primary 
                  dark:text-psl-active-text
                  `
                    }`}
                >
                  SignOut
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default memo(Appbar);
