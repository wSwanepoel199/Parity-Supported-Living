import { Backdrop, Box, Button, Checkbox, Chip, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { useFormControl } from '@mui/material/FormControl';
import Grid from "@mui/material/Unstable_Grid2/";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, memo, useMemo, useState } from "react";
import PhoneInput from 'react-phone-input-2';
import { useSelector } from "react-redux";
import { useCreateClientMutation } from "../../../Redux/client/clientApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import { selectUsers } from "../../../Redux/admin/adminSlice";
// import 'react-phone-input-2/lib/style.css';

const MyCustomInput = forwardRef((props, ref) => {
  const { component: Component, ...other } = props;
  return <Component
    {...other}
    inputClass={props.className}
    specialLabel=""
    disableDropdown
    country="au"
    placeholder="(04)"
    countryCodeEditable={false}
    inputProps={{
      name: props.name
    }}
  />;
});

const MyCustomHelperText = () => {
  const { focused } = useFormControl() || {};

  const helperText = useMemo(() => {
    if (focused) {
      return '0412 345 678';
    }
    return "";
  }, [focused]);

  return <FormHelperText className={`txt-secondary`}>{helperText}</FormHelperText>;
};

const containsText = (user, searchText) =>
  user.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const CreateClient = () => {
  const admin = useSelector(selectUsers);
  const options = admin.users;

  const { setOpenDialog } = useOutletContext();
  const navigate = useNavigate();

  const [createClient, { isLoading: isCreatingClient }] = useCreateClientMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: "",
    email: '',
    notes: '',
    carers: []
  });
  const [address, setAddress] = useState(Array(4).fill(''));
  const [searchText, setSearchText] = useState("");

  const displayedOptions = useMemo(
    () => options?.filter((option) => containsText(option.name, searchText)),
    [options, searchText]
  );

  const handleInput = (e) => {
    const { value, name } = e.target;
    const splitString = name.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g);
    if (splitString[0] === 'address') {
      switch (splitString[1]) {
        case "Street": {
          setAddress(prev => {
            prev[0] = value;
            return prev;
          });
          break;
        }
        case "City": {
          setAddress(prev => {
            prev[1] = value;
            return prev;
          });
          break;
        }
        case "State": {
          setAddress(prev => {
            prev[2] = value;
            return prev;
          });
          break;
        }
        case "ZIP": {
          setAddress(prev => {
            value.length > 4 ? prev[3] = value.slice(0, value.length - 1) : prev[3] = value;
            return prev;
          });
          break;
        }
        default: {
          return;
        }
      }
    }
    setFormData(prev => {
      const formField = (splitString[0] === 'address' || splitString[0] === 'carers') ? splitString[0] : name;
      const formValue = splitString[0] === 'address' ? address.join(', ') : value;
      return {
        ...prev,
        [formField]: formValue
      };
    });
  };

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    navigate('..');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createClient(formData).then(() => {
      handleExit();
    });
  };


  return (
    <>
      <Backdrop
        open={isCreatingClient}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>

      <Box component='form' onSubmit={(e) => handleSubmit(e)} className={`dialog-background h-full`}>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p" className={`txt-main`}>
            New Client
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon className={`interact-main`} />
          </IconButton>
        </DialogTitle>
        <DialogContent >
          <Grid container spacing={2} className="flex justify-center">
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
                  }}
                >Last Name</InputLabel>
                <Input
                  id="lastNameInput"
                  name="lastName"
                  type="text"
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
            <Grid sm={6} xs={12} id="phoneInput" className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="phoneInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}
                >Phone Number</InputLabel>
                <Input
                  id="phoneInput"
                  name="phoneNumber"
                  type="number"
                  inputComponent={MyCustomInput}
                  inputProps={{
                    component: PhoneInput,
                  }}
                  value={formData.phoneNumber}
                  onChange={(value, country, e, formattedValue) => handleInput(e)}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
                <MyCustomHelperText />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} id="emailInput" className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="emailInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}
                >Email</InputLabel>
                <Input
                  id="emailInput"
                  name="email"
                  type="text"
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
            <Grid xs={12} className="border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography className={`txt-main`}>Address</Typography>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="addressInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}
                >Street Address</InputLabel>
                <Input
                  id="addressInput"
                  name="addressStreet"
                  type="text"
                  value={address[0]}
                  onChange={handleInput}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="addressInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}
                >City</InputLabel>
                <Input
                  id="addressInput"
                  name="addressCity"
                  type="text"
                  value={address[1]}
                  onChange={handleInput}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="addressInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}
                >State</InputLabel>
                <Input
                  id="addressInput"
                  name="addressState"
                  type="text"
                  value={address[2]}
                  onChange={handleInput}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel
                  shrink
                  htmlFor="addressInput"
                  className={`txt-secondary`}
                  classes={{
                    focused: 'text-psl-active-link'
                  }}
                >ZIP/postal codes</InputLabel>
                <Input
                  id="addressInput"
                  name="addressZIP"
                  type="number"
                  value={address[3]}
                  onChange={handleInput}
                  disableUnderline
                  className={`txt-secondary dark:[color-scheme:dark] rounded-sm mui-input-inactive`}
                  classes={{
                    focused: 'mui-input-active'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} className="border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography className={`txt-main`}>Carers</Typography>
            </Grid>
            <Grid xs={12} className="flex justify-center">
              {options ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <Select
                    id="carerInput"
                    name='carersId'
                    multiple
                    value={formData.carers}
                    onChange={(e) => handleInput(e)}
                    onClose={() => setSearchText("")}
                    input={<OutlinedInput
                      id="carersListInput"
                      className={`txt-secondary rounded-sm border-2 border-solid border-psl-primary/40 dark:border-psl-secondary-text/40 hover:border-psl-active-link hover:dark:border-psl-active-link`}
                      classes={{
                        notchedOutline: 'border-0',
                        // focused: 'border-psl-active-link dark:border-psl-active-link border-2 border-solid',
                      }} />}
                    renderValue={(selected) => (
                      <Box
                        className={`flex flex-wrap gap-2`}
                      >
                        {selected.map((value, index) => {
                          return (
                            <Box key={index}>
                              <Chip label={options.find((user) => value === user.userId).name} classes={{
                                root: 'bg-psl-secondary'
                              }} />
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{
                      autoFocus: false,
                      disablePortal: true,
                      PopoverClasses: {
                        paper: 'bg-inherit',
                      },
                      PaperProps: {
                        id: 'carerId'
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
                    {displayedOptions?.map((user) => {
                      return (
                        <MenuItem key={user.userId} value={user.userId} className={`hover:text-psl-active-link`} classes={{ selected: 'text-psl-active-link' }}>
                          <Checkbox checked={formData.carers.indexOf(user.userId) > -1} classes={{
                            colorPrimary: 'text-psl-secondary',
                            checked: 'mui-checked',
                          }} />
                          {user.firstName} {user?.lastName}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl> : null}
            </Grid>
            <Grid xs={12} className="border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography className={`txt-main`}>Notes</Typography>
            </Grid>
            <Grid xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                {/* <InputLabel shrink htmlFor="notesInput">Notes</InputLabel> */}
                <OutlinedInput
                  id="notesInput"
                  name="notes"
                  type="text"
                  // label="Notes"
                  multiline
                  notched
                  minRows={4}
                  value={formData.notes}
                  onChange={handleInput}
                  className={`txt-secondary rounded-sm  border-2 border-solid border-psl-primary/40 dark:border-psl-secondary-text/40 hover:border-psl-active-link hover:dark:border-psl-active-link focus-within:border-psl-active-link focus-within:dark:border-psl-active-link `}
                  classes={{
                    notchedOutline: 'border-0 ',
                    focused: 'border-psl-active-link dark:border-psl-active-link border-2 border-solid',
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            type="submit"
            className={`bg-transparent bg-gradient-to-b from-transparent to-psl-secondary-text dark:to-psl-secondary hover:bg-psl-active-link hover:to-psl-active-link hover:dark:to-psl-active-link hover:dark:text-psl-primary text-psl-primary dark:text-psl-secondary-text shadow-none hover:shadow-none`}
          >Create</Button>
        </DialogActions>
      </Box>
    </>
  );
};

export default memo(CreateClient);