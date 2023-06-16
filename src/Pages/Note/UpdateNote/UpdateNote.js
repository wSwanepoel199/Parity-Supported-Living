import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import CloseIcon from '@mui/icons-material/Close';
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetPostQuery, useUpdatePostMutation } from "../../../Redux/posts/postApiSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const UpdatePost = () => {
  const { client, admin, root } = useSelector(state => {
    return {
      client: state.clients,
      admin: state.admin,
      root: state.root
    };
  });
  const params = useParams();
  const { data, isFetching, isLoading, isSuccess } = useGetPostQuery(params.id, { refetchOnMountOrArgChange: true });
  const mounted = useRef();
  const [openDialog, setOpenDialog, fullScreen] = useOutletContext();
  const navigate = useNavigate();
  const [updatePost] = useUpdatePostMutation();
  const [formData, setFormData] = useState(data);
  const [carerOptions, setCarerOptions] = useState([(data?.carer || "")]);
  const [clientOptions, setClientOptions] = useState([(data?.client || "")]);

  // useMemo(() => {
  //   if (adminState.users && carerOptions.length === 1) setCarerOptions(() => adminState.users);
  // }, [adminState.users, carerOptions]);

  // useMemo(() => {
  //   if (clientState.clients && clientOptions.length < 2) setClientOptions(() => clientState.clients);
  // }, [clientState.clients, clientOptions]);


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
      if (mounted.current) {
        mounted.current = false;
      }
    };
  }, [mounted, client.clients, clientOptions, admin.users, carerOptions, data, isSuccess, isLoading]);

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
            clientName: client.clients.find(client => client.clientId === value).name
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
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
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
        open={root.status === "loading"}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>
      {console.log(formData)}
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        className={`z-30 max-w-full`}
      >
        <Box component='form' onSubmit={(e) => handleSubmit(e)}>
          <DialogTitle className={`flex justify-between items-center`}>
            <Typography variant="h6" component="p">
              Edit Note
            </Typography>
            <IconButton onClick={() => handleExit()}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {mounted.current ?
            <DialogContent>
              <Grid container spacing={2} className="flex justify-center">
                <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
                  <Typography>Details</Typography>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="dateInput" >Support Date</InputLabel>
                    <Input
                      id="dateInput"
                      name="date"
                      type="date"
                      value={format(parseISO(formData.date), 'yyyy-MM-dd')}
                      onChange={(e) => handleInput(e.target)}
                    />
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel htmlFor="timeInput">Support Duration</InputLabel>
                    <Input
                      id="timeInput"
                      name="hours"
                      type="number"
                      value={formData.hours}
                      onChange={(e) => handleInput(e.target)}
                    />
                  </FormControl>
                </Grid>
                {(formData.client === "" && formData.clientId === "") ?
                  <Grid sm={6} xs={12} className="flex justify-center">
                    <FormControl size="small" fullWidth margin="dense">
                      <InputLabel htmlFor="clientInput">Client's Name</InputLabel>
                      <Input
                        id="clientInput"
                        name="client"
                        type="text"
                        disabled
                        value={formData.clientName}
                        onChange={(e) => handleInput(e.target)}
                      />
                      <FormHelperText>Client Details lost, please select new Client from dropdown</FormHelperText>
                    </FormControl>
                  </Grid> : null}
                <Grid sm={6} xs={12} className="flex justify-center">
                  {clientOptions ?
                    <FormControl variant="standard" size="small" fullWidth margin="dense">
                      <InputLabel htmlFor="clientInput">Client's Name</InputLabel>
                      <Select
                        id="clientInput"
                        name='clientId'
                        value={formData.clientId}
                        onChange={(e) => handleInput(e.target)}
                      >
                        {clientOptions.map((client, index) => {
                          return (
                            <MenuItem key={index} value={client.clientId}>{client.firstName} {client?.lastName}</MenuItem>
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
              <Button color="success" variant="contained" type="submit" disabled={formData.clientId === "" || formData.carerId === ""}>Update</Button>
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default UpdatePost;