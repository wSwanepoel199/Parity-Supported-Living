import { Backdrop, Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import CloseIcon from '@mui/icons-material/Close';
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetPostQuery, useUpdatePostMutation } from "../../../Redux/posts/postApiSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { selectClients } from "../../../Redux/client/clientSlice";
import { selectUsers } from "../../../Redux/admin/adminSlice";

const UpdateNote = () => {
  const client = useSelector(selectClients);
  const admin = useSelector(selectUsers);

  const params = useParams();
  const { data, isFetching, isLoading, isSuccess } = useGetPostQuery(params.id, { refetchOnMountOrArgChange: true });
  const mounted = useRef();
  const { setOpenDialog, fullScreen } = useOutletContext();
  const navigate = useNavigate();
  const [updatePost, { isLoading: isUpdatingPost }] = useUpdatePostMutation();
  const [formData, setFormData] = useState(data);
  const [carerOptions, setCarerOptions] = useState([(data?.carer || "")]);
  const [clientOptions, setClientOptions] = useState([(data?.client || "")]);
  const [focus, setFocus] = useState(undefined);


  useEffect(() => {
    if (isSuccess && !mounted.current) {
      const parsedPost = JSON.stringify(data).replace(/:null/gi, ":\"\"");
      setFormData(prev => {
        if (JSON.stringify(prev) !== parsedPost) {
          return {
            ...JSON.parse(parsedPost),
          };
        } else {
          return prev;
        }
      });
      if (admin.users && carerOptions.length === 1) setCarerOptions(admin.users);
      if (client.clients.length > 0 && clientOptions.length === 1) setClientOptions(client.clients);
      if ((data.carerName === null || data.carerName === "") && data.carerId !== "") setFormData(prev => {
        return {
          ...prev,
          carerName: `${data.carer.firstName} ${data.carer?.lastName}`
        };
      });
      mounted.current = true;
    };

    return () => {
      if (mounted.current) mounted.current = false;
    };
  }, [mounted, client.clients, clientOptions, admin.users, carerOptions, data, isSuccess, isLoading]);

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
            clientName: client.clients.find(client => client?.clientId === value).name
          };
        });
        return;
      }
      case 'carerId': {
        setFormData(prev => {
          return {
            ...prev,
            [name]: value,
            carerName: admin.users.find(carer => carer.userId === value).name
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
    setOpenDialog(prev => { return { ...prev, open: false, type: '', data: {} }; });
    navigate('..');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedForm = formData;
    Object.keys(parsedForm).forEach(key => {
      if (parsedForm[key] === '') {
        parsedForm[key] = null;
      }
    });
    updatePost(parsedForm).then(res => {
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
        open={isUpdatingPost}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>

      <Box component='form' onSubmit={(e) => handleSubmit(e)} className={`dialog-background  h-full`}>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p" className={`txt-main`}>
            Edit Note
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon className={`interact-main`} />
          </IconButton>
        </DialogTitle>
        {mounted.current ?
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
                        txt-secondary
                      `}
                    `}
                  >Support Duration</InputLabel>
                  <Input
                    id="timeInput"
                    name="hours"
                    type="number"
                    value={formData.hours}
                    onChange={(e) => handleInput(e.target)}
                    disableUnderline
                    className={`
                      txt-secondary
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
              {(formData.client === "" && formData?.clientId === "") ?
                <Grid sm={6} xs={12} id="clientDiabled" className="flex justify-center">
                  <FormControl
                    size="small"
                    fullWidth
                    margin="dense"
                  >
                    <InputLabel
                      htmlFor="clientInput"
                      className={`
                        txt-secondary
                      `}
                    >Client's Name</InputLabel>
                    <Input
                      id="clientInput"
                      name="client"
                      type="text"
                      disabled
                      value={formData.clientName}
                      className={`
                        txt-secondary
                      `}
                      classes={{
                        disabled: 'text-fill-psl-primary dark:text-fill-psl-secondary-text opacity-60'
                      }}
                    />
                    <FormHelperText className={`txt-secondary`}>Client Details lost, please select new Client from dropdown</FormHelperText>
                  </FormControl>
                </Grid> : null}
              <Grid sm={6} xs={12} id="clientInput" className="flex justify-center">
                {clientOptions ?
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
                    <InputLabel
                      htmlFor="clientInput"
                      className={`
                        ${document.activeElement.id === "clientId" ? `
                        text-psl-active-link
                        `: `
                          txt-secondary
                        `}`}
                    >Client's Name</InputLabel>
                    <Select
                      id="clientInput"
                      name='clientId'
                      value={formData?.clientId}
                      onChange={(e) => handleInput(e.target)}
                      disableUnderline
                      className={`
                        txt-secondary
                        rounded-sm
                        ${document.activeElement.id === "clientId" ? `
                          mui-input-active
                        `: `
                          mui-input-inactive
                        `}
                      `}
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
                      {clientOptions.map((client, index) => {
                        return (
                          <MenuItem key={index} value={client?.clientId} className={`hover:text-psl-active-link`}>{client.firstName} {client?.lastName}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl> : null}
              </Grid>
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel htmlFor="distanceInput">Distance Traveled</InputLabel>
                  <Input
                    id="distanceInput"
                    name="kilos"
                    type="number"
                    value={formData.kilos}
                    onChange={(e) => handleInput(e.target)}
                  />
                </FormControl>
              </Grid>
              {(formData.carer === "" && formData.carerId === "") ?
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel htmlFor="carerInput">Carer</InputLabel>
                    <Input
                      id="carerInput"
                      name="carer"
                      type="text"
                      disabled
                      value={formData.carerName}
                      onChange={(e) => handleInput(e.target)}
                    />
                    <FormHelperText>Carer details lost, please select Carer from dropdown</FormHelperText>
                  </FormControl>
                </Grid> : null}
              <Grid sm={6} xs={12} className="flex justify-center">
                {carerOptions ?
                  <FormControl variant="standard" size="small" fullWidth margin="dense">
                    <InputLabel htmlFor="CarerInput">Carer</InputLabel>
                    <Select
                      id="carerInput"
                      name='carerId'
                      value={formData.carerId}
                      onChange={(e) => handleInput(e.target)}
                    >
                      {carerOptions.map((user, index) => {
                        return (
                          <MenuItem key={index} value={user.userId}>{user.firstName} {user?.lastName}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl> : null}
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
          : null}
        <DialogActions sx={{ justifyContent: 'space-between', alignContent: 'space-between' }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData?.private}
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
          <Box >
            {!fullScreen &&
              <Button
                onClick={() => handleExit()}>Cancel</Button>}
            <Button color="success" variant="contained" type="submit" disabled={formData?.clientId === "" || formData?.carerId === ""}>Update</Button>
          </Box>
        </DialogActions>
      </Box>
    </>
  );
};

export default UpdateNote;