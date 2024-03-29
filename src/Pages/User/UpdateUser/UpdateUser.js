import { Backdrop, Box, Button, Checkbox, Chip, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Input, InputAdornment, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, Switch, Typography, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUpdateUserMutation } from "../../../Redux/user/userApiSlice";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetUserQuery } from "../../../Redux/admin/adminApiSlice";
import { selectClients } from "../../../Redux/client/clientSlice";

const containsText = (user, searchText) =>
  user.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const UpdateUser = () => {
  const clients = useSelector(selectClients);

  const { setOpenDialog } = useOutletContext();
  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isSuccess } = useGetUserQuery(params.id, {
    refetchOnMountOrArgChange: true
  });
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const mounted = useRef();
  const [formData, setFormData] = useState(data);


  const [searchText, setSearchText] = useState("");

  const [options, setOptions] = useState([]);

  const displayedOptions = useMemo(
    () => options?.filter((option) => containsText(option.name, searchText)),
    [options, searchText]
  );

  useEffect(() => {
    if (isSuccess && !mounted.current) {
      const { clients, ...selectedUser } = data;
      setFormData(prev => {
        const clientIds = clients.map(client => client.clientId);
        return {
          ...prev,
          ...JSON.parse(JSON.stringify(selectedUser).replace(/:null/gi, ":\"\"")),
          clients: [
            ...clientIds
          ]
        };
      });
      if (clients) setOptions(clients);
      mounted.current = true;
    }
    if (clients.clients.length > 0) setOptions(clients.clients);
    return () => {
      if (mounted.current) {
        mounted.current = false;
      }
    };
  }, [mounted, data, isSuccess, clients.clients]);

  const handleInput = (e) => {
    const { value, name } = e.target;
    setFormData(prev => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    navigate('..');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    delete formData.showPassword;
    delete formData?.name;
    updateUser(formData).then(() => {
      handleExit();
    });
  };

  if (isLoading || isFetching || !mounted.current) {
    return (
      <Backdrop
        open={true}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>
    );
  }

  return (
    <>
      <Backdrop
        open={isUpdatingUser}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>

      <Box component='form' onSubmit={(e) => handleSubmit(e)} className={`h-full`}>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p" className={`txt-main`}>
            Edit {formData?.firstName} {formData?.lastName}
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon className={`interact-main`} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="flex justify-center w-full">
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography className={`txt-main`}>Details</Typography>
            </Grid>
            <Grid sm={6} xs={12} id="firstNameInput" className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="firstNameInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}
                >First Name</InputLabel>
                <Input
                  id="firstNameInput"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInput}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} id="lastNameInput" className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="lastNameInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}>Last Name</InputLabel>
                <Input
                  id="lastNameInput"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInput}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} id="roleInput" className="flex justify-center">
              {["Admin", "Carer", "Coordinator"].includes(formData.role) ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <InputLabel
                    shrink
                    htmlFor="roleInput"
                    className={`px-5 txt-secondary`}
                    classes={{
                      focused: 'text-psl-active-link'
                    }}>Role</InputLabel>
                  <Select
                    id="roleInput"
                    name='role'
                    required
                    value={formData.role}
                    onChange={handleInput}
                    disableUnderline
                    className={`txt-secondary rounded-sm mui-input-inactive`}
                    classes={{
                      icon: `txt-secondary`,
                      iconOpen: 'text-psl-active-link',
                      focused: 'mui-input-active'
                    }}
                    MenuProps={{
                      disablePortal: true,
                      PopoverClasses: {
                        paper: 'bg-inherit',
                      },
                      PaperProps: {
                        id: 'clientId'
                      },
                      MenuListProps: {
                        classes: {
                          root: 'txt-main'
                        },
                        className: 'dialog-background'
                      }
                    }}
                  >
                    <MenuItem className={`hover:text-psl-active-link`} classes={{ selected: 'text-psl-active-link' }} value={"Admin"}>Admin</MenuItem>
                    <MenuItem className={`hover:text-psl-active-link`} classes={{ selected: 'text-psl-active-link' }} value={"Carer"}>Carer</MenuItem>
                    <MenuItem className={`hover:text-psl-active-link`} classes={{ selected: 'text-psl-active-link' }} value={"Coordinator"}>Coordinator</MenuItem>
                  </Select>
                </FormControl> : null}
            </Grid>
            <Grid sm={6} xs={12} id="emailInput" className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="emailInput"
                  className={`px-5 txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}>Email</InputLabel>
                <Input
                  id="emailInput"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInput}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography className="txt-main">Clients</Typography>
            </Grid>
            <Grid xs={12} id="clientsInput" className="flex justify-center">
              {options ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <Select
                    id="clientsInput"
                    name='clients'
                    multiple
                    value={formData.clients}
                    onChange={(e) => handleInput(e)}
                    onClose={() => setSearchText("")}
                    renderValue={(selected) => (
                      <Box
                        className={`flex flex-wrap gap-2`}
                      >
                        {selected.map((value) => {
                          return (
                            <Box key={value}>
                              <Chip
                                label={options.find((user) => value === user.clientId).name} classes={{
                                  root: 'bg-psl-secondary shadow'
                                }} />
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    input={<OutlinedInput
                      id="clientsListInput"
                      className={`txt-secondary rounded-sm border-2 border-solid border-psl-primary/40 dark:border-psl-secondary-text/40 hover:border-psl-active-link hover:dark:border-psl-active-link`}
                      classes={{
                        notchedOutline: 'border-0',
                        // focused: 'border-psl-active-link dark:border-psl-active-link border-2 border-solid',
                      }}
                    />}
                    MenuProps={{
                      autoFocus: false,
                      disablePortal: true,
                      PopoverClasses: {
                        paper: 'bg-inherit',
                      },
                      PaperProps: {
                        id: 'clientId'
                      },
                      MenuListProps: {
                        classes: {
                          root: 'txt-main'
                        },
                        className: 'dialog-background'
                      }
                    }}
                    classes={{
                      icon: `txt-secondary`,
                      iconOpen: 'text-psl-active-link',
                    }}
                  >
                    <ListSubheader
                      className='dialog-background'>
                      <Input
                        size="small"
                        autoFocus
                        fullWidth
                        startAdornment={
                          <InputAdornment position="start">
                            <SearchIcon className={`txt-secondary`} />
                          </InputAdornment>
                        }
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== "Escape") {
                            // Prevents autoselecting item while typing (default Select behaviour)
                            e.stopPropagation();
                          }
                        }}
                        disableUnderline
                        className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                        classes={{
                          focused: 'mui-input-active'
                        }}
                      />
                    </ListSubheader>
                    {displayedOptions?.map((client) => {
                      return (
                        <MenuItem key={client.clientId} value={client.clientId} className={`hover:text-psl-active-link`} classes={{ selected: 'text-psl-active-link' }}>
                          <Checkbox
                            checked={formData.clients.indexOf(client.clientId) > -1}
                            classes={{
                              colorPrimary: 'text-psl-secondary',
                              checked: 'mui-checked',
                            }}
                          />
                          {client.firstName} {client?.lastName}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl> : null}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={`justify-between content-between mx-2`}>
          <FormControlLabel
            id="passResetSwitch"
            control={
              <Switch
                checked={formData.resetPassword}
                onChange={() => setFormData(prev => {
                  return {
                    ...prev,
                    resetPassword: !prev.resetPassword
                  };
                }
                )}
                inputProps={{
                  name: 'resetSwitch'
                }}
                classes={{
                  checked: 'text-psl-active-link',
                  track: `${formData.resetPassword && 'bg-psl-active-link'}`
                }}
              />}
            label="Toggle Password Reset"
            componentsProps={{
              typography: {
                className: `txt-secondary`
              }
            }}
          />
          <Box >
            <Button
              variant="contained"
              type="submit"
              className={`bg-transparent bg-gradient-to-b from-transparent to-psl-secondary-text dark:to-psl-secondary hover:bg-psl-active-link hover:to-psl-active-link hover:dark:to-psl-active-link hover:dark:text-psl-primary text-psl-primary dark:text-psl-secondary-text shadow-none hover:shadow-none`}>UPDATE</Button>
          </Box>
        </DialogActions>
      </Box>
    </>
  );
};

export default UpdateUser;