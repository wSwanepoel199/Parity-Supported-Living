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

  const { setOpenDialog } = useOutletContext();
  const navigate = useNavigate();
  const [addPost, { isLoading }] = useAddPostMutation();
  const [formData, setFormData] = useState({
    date: '',
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
          if (value) {
            return {
              ...prev,
              [name]: formatISO(new Date(value))
            };
          } else {
            return {
              ...prev,
              [name]: ''
            };
          }
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

      <Box component='form' onSubmit={(e) => handleSubmit(e)} className={`dialog-background h-full`}>
        {/* {console.log(formData)} */}
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p" className={`txt-main`}>
            New Note
          </Typography>
          <IconButton onClick={() => handleExit()} >
            <CloseIcon className={`interact-main`} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="flex justify-center">
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography className={`txt-main`}>Details</Typography>
            </Grid>
            <Grid sm={6} xs={12} id="dateInput" className="flex justify-center">
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
                  txt-secondary
                  `}`}
                >Support Date</InputLabel>
                <Input
                  id="dateInput"
                  name="date"
                  type="date"
                  required
                  onClick={(e) => e.target.showPicker()}
                  value={formData.date ? format(parseISO(formData.date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleInput(e.target)}
                  disableUnderline
                  className={`
                    txt-secondary
                    dark:[color-scheme:dark]
                    rounded-sm
                    ${document.activeElement.name === "date" ? `
                      mui-input-active
                    `: `
                      mui-input-inactive
                    `}`}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} id="timeInput" className="flex justify-center">
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
                    txt-secondary
                    dark:[color-scheme:dark]
                    rounded-sm
                    ${document.activeElement.name === "hours" ? `
                      mui-input-active
                    `: `
                      mui-input-inactive
                    `}
                  `}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} id="clientInput" className="flex justify-center">
              <FormControl
                variant="standard"
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
                {/* try and get select to respond to focus, god know show but just try please */}
                <InputLabel
                  htmlFor="clientInput"
                  className={`
                ${document.activeElement.id === "clientId" ? `
                  text-psl-active-link
                `: `
                  txt-secondary
                `}`}
                >Client</InputLabel>
                <Select
                  id="clientInput"
                  name='clientId'
                  required
                  value={formData.clientId}
                  onChange={(e) => handleInput(e.target)}
                  disableUnderline
                  className={`
                  txt-secondary
                  rounded-sm
                  ${document.activeElement.id === "clientId" ? `
                    mui-input-active
                  `: `
                    mui-input-inactive
                  `}`}
                  classes={{
                    icon: `${document.activeElement.id === "clientId" ? `
                      text-psl-active-link
                    `: `
                      txt-secondary
                    `}`
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
                  {options.map((client) => {
                    return (
                      <MenuItem key={client.id} value={client?.clientId} className={`hover:text-psl-active-link`}>{client?.firstName} {client?.lastName}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} id="distanceInput" className="flex justify-center">
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
                  htmlFor="distanceInput"
                  className={`
                ${document.activeElement.name === "kilos" ? `
                text-psl-active-link
                `: `
                text-psl-primary
                dark:text-psl-secondary-text
                `}`}
                >Distance Traveled</InputLabel>
                <Input
                  id="distanceInput"
                  name="kilos"
                  type="number"
                  required
                  value={formData.kilos}
                  onChange={(e) => handleInput(e.target)}
                  disableUnderline
                  className={`
                text-psl-primary 
                dark:text-psl-secondary-text
                rounded-sm
                ${document.activeElement.name === "kilos" ? `
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
            <Grid xs={12} className="border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography
                className={`text-psl-primary dark:text-psl-secondary-text`}
              >Notes</Typography>
            </Grid>
            <Grid xs={12} id="notesInput" className="flex justify-center">
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
                }}>
                <OutlinedInput
                  id="notesInput"
                  name="notes"
                  type="text"
                  multiline
                  minRows={4}
                  value={formData.notes}
                  onChange={(e) => handleInput(e.target)}
                  className={`
                text-psl-primary 
                dark:text-psl-secondary-text
                rounded-sm
                ${document.activeElement.name === "notes" ? `
                  border-psl-active-link
                  border-2
                  border-solid
                `: `
                  border-2
                  border-solid
                  border-psl-primary/40
                  dark:border-psl-secondary-text/40
                  hover:border-psl-active-link
                  hover:dark:border-psl-active-link
                `}`}
                  classes={{
                    notchedOutline: 'border-0'
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={`justify-between content-between mx-2`}>
          <FormControlLabel
            id="privateSwitch"
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
                inputProps={{
                  name: 'private'
                }}
                classes={{
                  checked: 'text-psl-active-link',
                  track: `${formData.private && 'bg-psl-active-link'}`
                }}
              />}
            label="Confidential"
            componentsProps={{
              typography: {
                className: `text-psl-primary dark:text-psl-secondary-text`
              }
            }}
          />
          <Box>
            <Button
              variant="contained"
              type="submit"
              className={`bg-transparent bg-gradient-to-b from-transparent to-psl-secondary-text dark:to-psl-secondary hover:bg-psl-active-link hover:to-psl-active-link hover:dark:to-psl-active-link hover:dark:text-psl-primary text-psl-primary dark:text-psl-secondary-text shadow-none hover:shadow-none`}
            >Create</Button>
          </Box>
        </DialogActions>
      </Box >
    </>
  );
};

export default CreateNote;