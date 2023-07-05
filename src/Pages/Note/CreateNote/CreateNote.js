import { Backdrop, Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import CloseIcon from '@mui/icons-material/Close';
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddPostMutation } from "../../../Redux/posts/postApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import { selectUser } from "../../../Redux/user/userSlice";
import { selectClients } from "../../../Redux/client/clientSlice";

const CreateNote = () => {
  const user = useSelector(selectUser);
  const client = useSelector(selectClients);

  const { setOpenDialog, fullScreen } = useOutletContext();
  const navigate = useNavigate();
  const [addPost, { isLoading }] = useAddPostMutation();
  const [formData, setFormData] = useState({
    date: formatISO(new Date()),
    hours: 0,
    kilos: 0,
    clientId: "",
    notes: "",
    carerId: user.user.userId,
    private: false,
  });
  const [options, setOptions] = useState([]);
  const [focus, setFocus] = useState(undefined);

  useEffect(() => {
    if (client.clients.length > 0) setOptions(client.clients);
    // if (isLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });

  }, [client.clients]);

  const handleInput = ({ value, name }) => {
    switch (name) {
      case "date": {
        setFormData(prev => {
          return {
            ...prev,
            [name]: formatISO(new Date(value))
          };
        });
        return;
      }
      case "kilos":
      case "hours": {
        setFormData(prev => {
          return {
            ...prev,
            [name]: parseInt(value)
          };
        });
        return;
      }
      case 'clientId': {
        setFormData(prev => {
          return {
            ...prev,
            [name]: value,
          };
        });
        return;
      }
      default: {
        setFormData(prev => {
          return {
            ...prev,
            [name]: value
          };
        });
      }
    }
  };

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    navigate('..');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(formData).then(res => {
      handleExit();
    });
  };


  return (
    <>
      <Backdrop
        open={isLoading}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>

      <Box component='form' onSubmit={(e) => handleSubmit(e)} className={`bg-psl-active-text dark:bg-psl-primary`}>
        {/* {console.log(formData)} */}
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p" className={`text-psl-primary dark:text-psl-active-text`}>
            New Note
          </Typography>
          <IconButton onClick={() => handleExit()} >
            <CloseIcon className={`text-psl-primary dark:text-psl-active-text`} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="flex justify-center">
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography className={`text-psl-primary dark:text-psl-secondary-text`}>Details</Typography>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl
                size="small"
                fullWidth
                margin="dense"
                onFocus={(e) => {
                  if (e !== focus) setFocus(e);
                  document.activeElement.focus();
                }}
                onBlur={() => {
                  setFocus(undefined);
                  document.activeElement.blur();
                }}
              >
                <InputLabel
                  shrink
                  htmlFor="dateInput"
                  className={`
                  ${document.activeElement.name === "date" ? `
                  text-psl-active-link
                  `: `
                  text-psl-primary
                  dark:text-psl-secondary-text
                  `}`}
                >Support Date</InputLabel>
                <Input
                  id="dateInput"
                  name="date"
                  type="date"
                  required
                  value={format(parseISO(formData.date), 'yyyy-MM-dd')}
                  onChange={(e) => handleInput(e.target)}
                  disableUnderline
                  className={`
                text-psl-primary
                dark:text-psl-secondary-text
                  dark:[color-scheme:dark]
                rounded-sm
                ${document.activeElement.name === "date" ? `
                  border-b-psl-active-link
                  border-0 border-b-2
                  border-solid
                `: `
                  border-0
                  border-solid
                  border-b-2
                  border-b-psl-primary/40
                  dark:border-b-psl-secondary-text/40
                  hover:border-b-psl-active-link
                  hover:dark:border-b-psl-active-link
                `}`}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl
                size="small"
                fullWidth
                margin="dense"
                onFocus={(e) => {
                  if (e !== focus) setFocus(e);
                  document.activeElement.focus();
                }}
                onBlur={() => {
                  setFocus(undefined);
                  document.activeElement.blur();
                }}
              >
                <InputLabel
                  htmlFor="timeInput"
                  className={`
                ${document.activeElement.name === "hours" ? `
                text-psl-active-link
                `: `
                text-psl-primary
                dark:text-psl-secondary-text
                `}`}
                >Support Duration</InputLabel>
                <Input
                  id="timeInput"
                  name="hours"
                  type="number"
                  required
                  value={formData.hours}
                  onChange={(e) => handleInput(e.target)}
                  disableUnderline
                  className={`
                text-psl-primary 
                dark:text-psl-secondary-text
                rounded-sm
                ${document.activeElement.name === "hours" ? `
                  border-b-psl-active-link
                  border-0 border-b-2
                  border-solid
                `: `
                  border-0
                  border-solid
                  border-b-2
                  border-b-psl-primary/40
                  dark:border-b-psl-secondary-text/40
                  hover:border-b-psl-active-link
                  hover:dark:border-b-psl-active-link
                `}`}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl
                variant="standard"
                size="small"
                fullWidth
                margin="dense"
                onFocus={(e) => {
                  if (e !== focus) setFocus(e);
                  console.log(e);
                  document.activeElement.focus();
                }}
                onBlur={() => {
                  setFocus(undefined);
                  document.activeElement.blur();
                }}
              >
                {/* try and get select to respond to focus, god know show but just try please */}
                <InputLabel
                  htmlFor="clientInput"
                  className={`
                ${document.activeElement.name === "clientId" ? `
                  text-psl-active-link
                `: `
                  text-psl-primary
                  dark:text-psl-secondary-text
                `}`}
                >Client</InputLabel>
                {console.log(document.activeElement.name === "clientId", document.activeElement.name)}
                <Select
                  id="clientInput"
                  name='clientId'
                  required
                  value={formData.clientId}
                  onChange={(e) => handleInput(e.target)}
                  disableUnderline
                  className={`
                  text-psl-primary 
                  dark:text-psl-secondary-text
                  rounded-sm
                  ${document.activeElement.name === "clientId" ? `
                    border-b-psl-active-link
                    border-0 border-b-2
                    border-solid
                  `: `
                    border-0
                    border-solid
                    border-b-2
                    border-b-psl-primary/40
                    dark:border-b-psl-secondary-text/40
                    hover:border-b-psl-active-link
                    hover:dark:border-b-psl-active-link
                  `}`}
                  classes={{
                    icon: `${document.activeElement.name === "clientId" ? `
                      text-psl-active-link
                    `: `
                      text-psl-primary
                      dark:text-psl-secondary-text
                    `}`
                  }}
                  SelectDisplayProps={{
                    name: 'clientId'
                  }}
                  MenuProps={{
                    name: 'clientId',
                    PopoverClasses: {
                      paper: 'bg-inherit',
                      name: 'clientId'
                    },
                    MenuListProps: {
                      name: 'clientId',
                      classes: {
                        root: 'text-psl-primary-text dark:text-psl-active-text'
                      },
                      className: 'dark:bg-psl-primary bg-psl-active-text'
                    }
                  }}
                >
                  {options.map((client) => {
                    return (
                      <MenuItem key={client.id} name="clientId" value={client?.clientId}>{client?.firstName} {client?.lastName}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel htmlFor="distanceInput">Distance Traveled</InputLabel>
                <Input
                  id="distanceInput"
                  name="kilos"
                  type="number"
                  required
                  value={formData.kilos}
                  onChange={(e) => handleInput(e.target)}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Notes</Typography>
            </Grid>
            <Grid xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <OutlinedInput
                  id="notesInput"
                  name="notes"
                  type="text"
                  multiline
                  minRows={4}
                  value={formData.notes}
                  onChange={(e) => handleInput(e.target)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', alignContent: 'space-between' }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.private}
                onChange={() => setFormData(prev => {
                  return {
                    ...prev,
                    private: !prev.private
                  };
                }
                )}

              />}
            label="Confidential"

          />
          <Box>
            {!fullScreen &&
              <Button
                onClick={() => handleExit()}>Cancel</Button>}
            <Button color="success" variant="contained" type="submit">Create</Button>
          </Box>
        </DialogActions>
      </Box >
    </>
  );
};

export default CreateNote;