import { Box, Button, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { format, parseISO } from "date-fns";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";
import ViewPost from "./ViewPost";
import ConfirmDialog from "./ConfirmDialog";
import GeneralDataGrid from "../GeneralDataGrid";

const Posts = () => {
  const postState = useSelector(state => state.posts);
  const userState = useSelector(state => state.user);


  const [table, setTable] = useState({
    columns: [
      {
        field: 'carerId',
        disableColumnMenu: true,
      },
      {
        field: 'clientId',
        disableColumnMenu: true,
      },
      {
        field: 'private',
        headerName: 'Private',
        disableColumnMenu: true,
        width: 65,
        sortable: false,
        renderCell: ({ value }) => {
          return (
            <Box className={`w-full flex justify-center items-center flex-row`}>
              {value ? <DoneIcon /> : <CloseIcon />}
            </Box>
          );
        },
        valueFormatter: ({ value }) => {
          return value;
        }
      },
      {
        field: 'date',
        headerName: 'Date',
        disableColumnMenu: true,
        valueFormatter: ({ value }) => `${value}`,
        renderCell: ({ value }) => value ? <p>{format(parseISO(value), 'dd/MM/yyyy')}</p> : null,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'client',
        headerName: 'Client',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => {
          if (row.clientId === "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>
              <PriorityHighIcon fontSize="small" color="error" /> {row.clientName}</p>;
          } else if (row.clientName === "" && row.clientId !== "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}><PriorityHighIcon fontSize="small" color="error" /> {`${row.client.firstName} ${row.client?.lastName}`}</p>;
          } else {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{`${row.client.firstName} ${row.client?.lastName}`}</p>;
          }
        },
        disableExport: true
      },
      {
        field: 'clientName',
        disableColumnMenu: true,
      },
      {
        field: 'carer',
        headerName: 'Carer',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 100,
        maxWidth: 150,
        renderCell: ({ row }) => {
          if (row.carerId === "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>
              <PriorityHighIcon fontSize="small" color="error" /> {row.carerName}</p>;
          } else if (row.carerName === "" && row.carerId !== "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}><PriorityHighIcon fontSize="small" color="error" /> {`${row.carer.firstName} ${row.carer?.lastName}`}</p>;
          } else {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{`${row.carer.firstName} ${row.carer?.lastName}`}</p>;
          }
        },
        disableExport: true
      },
      {
        field: 'carerName',
        disableColumnMenu: true,
      },
      {
        field: 'hours',
        headerName: 'Hours',
        disableColumnMenu: true,
        width: 60
      },
      {
        field: 'kilos',
        headerName: 'Distance(KM)',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 110,
      },
      {
        field: 'notes',
        headerName: 'Notes',
        disableColumnMenu: true,
        flex: 3,
        minWidth: 200,
        renderCell: (value) => {
          const splitAtLineBreak = value.row.notes.split(/\r?\n/);
          const string = splitAtLineBreak.length >= 2 ? splitAtLineBreak[0] + "..." : splitAtLineBreak[0];
          return (
            <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`} >{string}</Box>
          );
        }
      },
    ],
    rows: [],
    pageSize: 10,
  });

  useEffect(() => {
    if (postState.posts) {
      setTable(prev => {
        return {
          ...prev,
          rows: JSON.parse(JSON.stringify(postState.posts).replace(/:null/gi, ":\"\""))
        };
      });
    }
  }, [postState.posts]);

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col ">
      {console.log(JSON.stringify(table))}
      <Typography variant="h3" component="div" className={`py-5`}>Notes</Typography>
      <GeneralDataGrid
        intialTable={table}
        type="post"
        optionPermissions={{
          create: userState.status === 'loggedIn',
          edit: ["Admin", "Coordinator"].includes(userState.user.role),
          view: userState.status === 'loggedIn',
          delete: ["Admin", "Coordinator"].includes(userState.user.role),
        }}
        tableArray={postState.posts}
        dialogOptions={{
          Create: (props) => <CreatePost {...props} />,
          Update: (props) => <UpdatePost {...props} />,
          View: (props) => <ViewPost {...props} />,
          Delete: (props) => <ConfirmDialog {...props} />,
        }}
        NewEntry={(props) => <Button startIcon={<AddIcon />} {...props}>
          New Note
        </Button>
        }
        columns={{
          columnVisibilityModel: {
            // Hides listed coloumns
            carerId: false,
            clientId: false,
            clientName: false,
            carerName: false,
            // options: !fullScreen,
            private: ["Admin", "Coordinator"].includes(userState.user.role) ? true : false
          },
        }}
        sorting={{
          sortModel: [
            {
              field: 'date',
              sort: 'desc',
            },
          ],
        }}
      />
    </div>
  );
};

export default memo(Posts);