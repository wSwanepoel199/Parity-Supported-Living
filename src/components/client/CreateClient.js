import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Input, InputLabel, MenuItem, OutlinedInput, Select, TextField, useFormControl } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useCreateUserMutation } from "../../shared/redux/user/userApiSlice";
import PhoneInput from 'react-phone-input-2';
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

const CreateClient = ({ setOpenDialog }) => {
  const [createUser, { isSuccess, isError }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: "",
    email: '',
    details: '',
  });

  useEffect(() => {
    if (isSuccess || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  }, [isSuccess, isError, setOpenDialog]);

  const handleInput = (e) => {
    const { value, name } = e.target;

    setFormData(prev => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // createUser(formData);
    // setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };


  return (
    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
      <DialogTitle>
        New Client
      </DialogTitle>
      <DialogContent >
        <Grid container spacing={2} className="flex justify-center w-full">
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="firstNameInput">First Name</InputLabel>
              <Input
                id="firstNameInput"
                name="firstName"
                type="text"
                required
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
                required
                value={formData.lastName}
                onChange={handleInput}
              />
            </FormControl>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="addressInput">Address</InputLabel>
              <Input
                id="addressInput"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleInput}
              />
            </FormControl>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="emailInput">Email</InputLabel>
              <Input
                id="emailInput"
                name="email"
                type="email"
                required
                value={formData.email}
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
                inputComponent={MyCustomInput}
                inputProps={{
                  component: PhoneInput,
                }}
                required
                value={formData.phoneNumber}
                onChange={(value, country, e, formattedValue) => handleInput(e)}
              />
              <MyCustomHelperText />
            </FormControl>
          </Grid>
          <Grid xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="detailsInput">Details</InputLabel>
              <OutlinedInput
                id="detailsInput"
                name="details"
                type="text"
                label="Details"
                multiline
                minRows={4}
                value={formData.details}
                onChange={handleInput}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit">Create</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default CreateClient;