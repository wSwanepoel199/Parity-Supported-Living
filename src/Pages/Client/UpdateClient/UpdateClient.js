import { Backdrop, Box, Button, Checkbox, Chip, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { useFormControl } from '@mui/material/FormControl';
import Grid from "@mui/material/Unstable_Grid2/";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, memo, useMemo, useState, useRef, useEffect } from "react";
import PhoneInput from 'react-phone-input-2';
import { useSelector } from "react-redux";
import { useGetClientQuery, useUpdateClientMutation } from "../../../Redux/client/clientApiSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
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
      return '04 1234 5678';
    }
    return "";
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
};

const containsText = (user, searchText) =>
  user.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const UpdateClient = () => {
  const { admin, root } = useSelector(state => {
    return {
      admin: state.admin,
      root: state.root
    };
  });
  const options = admin.users;
  const mounted = useRef();

  const [openDialog, setOpenDialog, fullScreen] = useOutletContext();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading, isFetching, isSuccess } = useGetClientQuery(params.id, { refetchOnMountOrArgChange: true });


  const [updateClient] = useUpdateClientMutation();
  const [formData, setFormData] = useState(data);

  const [address, setAddress] = useState(data?.address.split(', ') || ["", "", "", ""]);
  const [searchText, setSearchText] = useState("");

  const displayedOptions = useMemo(
    () => options?.filter((option) => containsText(option.name, searchText)),
    [options, searchText]
  );

  useEffect(() => {
    if (isSuccess && !mounted.current) {
      // const parsedClient = JSON.stringify(data).replace(/:null/gi, ":\"\"");
      // setFormData(prev => {
      //   if (JSON.stringify(prev) !== parsedClient) {
      //     return {
      //       ...JSON.parse(parsedClient),
      //     };
      //   } else {
      //     return prev;
      //   }
      // });
      const { carers, ...selectedClient } = data;
      setFormData(prev => {
        const carersIds = carers.map(carer => carer.userId);
        return {
          ...prev,
          ...JSON.parse(JSON.stringify(selectedClient).replace(/:null/gi, ":\"\"")),
          carers: [
            ...carersIds
          ]
        };
      });
      setAddress(data.address.split(', '));
      // if ((data.carerName === null || data.carerName === "") && data.carerId !== "") setFormData(prev => {
      //   return {
      //     ...prev,
      //     carerName: `${data.carer.firstName} ${data.carer?.lastName}`
      //   };
      // });
      mounted.current = true;
    };

    return () => {
      if (mounted.current) {
        mounted.current = false;
      }
    };
  }, [mounted, data, isSuccess, isLoading]);

  // useMemo(() => {
  //   const { carers, ...selectedClient } = data;
  //   setFormData(prev => {
  //     const carersIds = carers.map(carer => carer.userId);
  //     return {
  //       ...prev,
  //       ...JSON.parse(JSON.stringify(selectedClient).replace(/:null/gi, ":\"\"")),
  //       carers: [
  //         ...carersIds
  //       ]
  //     };
  //   });
  // }, [data]);

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
    updateClient(formData).then(() => {
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
        open={root.status === "loading"}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>

      <Box component='form' onSubmit={(e) => handleSubmit(e)}>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p">
            Edit {data.name}
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent >
          <Grid container spacing={2} className="flex justify-center w-full">
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Details</Typography>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="firstNameInput">First Name</InputLabel>
                <Input
                  id="firstNameInput"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="lastNameInput">Last Name</InputLabel>
                <Input
                  id="lastNameInput"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="phoneInput">Phone Number</InputLabel>
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
                />
                <MyCustomHelperText />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="emailInput">Email</InputLabel>
                <Input
                  id="emailInput"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} className="border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Address</Typography>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="addressInput">Street Address</InputLabel>
                <Input
                  id="addressInput"
                  name="addressStreet"
                  type="text"
                  value={address[0]}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="addressInput">City</InputLabel>
                <Input
                  id="addressInput"
                  name="addressCity"
                  type="text"
                  value={address[1]}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="addressInput">State</InputLabel>
                <Input
                  id="addressInput"
                  name="addressState"
                  type="text"
                  value={address[2]}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="addressInput">ZIP/postal codes</InputLabel>
                <Input
                  id="addressInput"
                  name="addressZIP"
                  type="number"
                  value={address[3]}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} className="border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Carers</Typography>
            </Grid>
            <Grid xs={12} className="flex justify-center">
              {options ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <Select
                    id="carerInput"
                    name='carersId'
                    multiple
                    input={<OutlinedInput id="carersListInput" />}
                    renderValue={(selected) => (
                      <Box
                        className={`flex flex-wrap gap-2`}
                      >
                        {console.log(selected)}
                        {selected.map((value, index) => {
                          return (
                            <Box key={index}>
                              <Chip label={options.find((user) => value === user.userId)?.name} />
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{ autoFocus: false }}
                    value={formData.carers}
                    onChange={(e) => handleInput(e)}
                    onClose={() => setSearchText("")}
                  >
                    <ListSubheader>
                      <Input
                        size="small"
                        autoFocus
                        fullWidth
                        startAdornment={
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        }
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== "Escape") {
                            // Prevents autoselecting item while typing (default Select behaviour)
                            e.stopPropagation();
                          }
                        }}
                      />
                    </ListSubheader>
                    {displayedOptions?.map((user, index) => {
                      return (
                        <MenuItem key={index} value={user.userId}>
                          <Checkbox checked={formData.carers.indexOf(user.userId) > -1} />
                          {user.firstName} {user?.lastName}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl> : null}
            </Grid>
            <Grid xs={12} className="border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Notes</Typography>
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
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {!fullScreen &&
            <Button onClick={() => handleExit()}>Cancel</Button>}
          <Button color="success" variant="contained" type="submit">UPDATE</Button>
        </DialogActions>
      </Box>
    </>
  );
};

export default UpdateClient;