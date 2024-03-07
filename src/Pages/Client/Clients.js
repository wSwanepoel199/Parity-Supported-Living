import {
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Suspense, memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { DataGridMenu, GeneralDataGrid } from "../../Components";
import { selectClients } from "../../Redux/client/clientSlice";
import { selectUser } from "../../Redux/user/userSlice";

const Clients = () => {
  const clients = useSelector(selectClients);
  const user = useSelector(selectUser);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const match = useMatch("/clients");

  const permissions = {
    create: ["Admin"].includes(user.user.role),
    edit: ["Admin"].includes(user.user.role),
    view: user.status === "loggedIn",
    delete: ["Admin"].includes(user.user.role),
  };

  const [table, setTable] = useState({
    columns: [
      {
        field: "id",
        disableExport: true,
        filterable: false,
      },
      {
        field: "clientId",
        sortable: false,
        filterable: false,
      },
      {
        field: "firstName",
        valueGetter: ({ row }) => {
          return row.firstName || null;
        },
      },
      {
        field: "lastName",
        valueGetter: ({ row }) => {
          return row.lastName || null;
        },
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 85,
        valueGetter: ({ row }) => {
          return row.name || null;
        },
        renderCell: ({ value }) => (
          <Box
            className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
          >
            {value}
          </Box>
        ),
        disableExport: true,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        minWidth: 85,
        valueGetter: ({ row }) => {
          return row.email || null;
        },
        renderCell: ({ value }) => (
          <Box
            className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
          >
            {value}
          </Box>
        ),
      },
      {
        field: "phoneNumber",
        headerName: "Number",
        flex: 1,
        minWidth: 100,
        valueGetter: ({ row }) => {
          return row.phoneNumber || null;
        },
        renderCell: ({ value }) => (
          <Box
            className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
          >
            {value}
          </Box>
        ),
      },
      {
        field: "address",
        headerName: "Address",
        flex: 1,
        minWidth: 100,
        valueGetter: ({ row }) => {
          return row.address || null;
        },
        renderCell: ({ value }) => (
          <Box
            className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
          >
            {value}
          </Box>
        ),
      },
      {
        field: "carersName",
        headerName: "Carers",
        disableExport: true,
        flex: 2,
        minWidth: 100,
        valueGetter: ({ row }) => {
          const carers = row.carers
            .map((carer) => `${carer.firstName}`)
            .join(", ");
          return carers || null;
        },
        renderCell: (params) => {
          const carers = params.row.carers
            .map((carer) => `${carer.firstName}`)
            .join(", ");
          return (
            <Box
              className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
            >
              {carers}
            </Box>
          );
        },
      },
      {
        field: "notes",
        headerName: "Notes",
        disableColumnMenu: true,
        flex: 2,
        minWidth: 150,
        valueGetter: ({ row }) => {
          return row.notes || null;
        },
        renderCell: (value) => {
          const splitAtLineBreak = value.row.notes.split(/\r?\n/);
          const string =
            splitAtLineBreak.length >= 2
              ? splitAtLineBreak[0] + "..."
              : splitAtLineBreak[0];
          return (
            <Box
              className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
            >
              {string}
            </Box>
          );
        },
      },
      {
        field: "carers",
        headerName: "userIds",
        disableColumnMenu: true,
        sortable: false,
        filterable: false,
        valueFormatter: (params) => {
          return params.value.map((carer) => carer.userId).join(", ");
        },
      },
      {
        field: "options",
        headerName: "Options",
        width: permissions.edit ? 130 : 70,
        disableColumnMenu: true,
        disableColumnFilter: true,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box className={`flex justify-center`}>
            <IconButton
              onClick={() => {
                setSelectedRow(params.row.id);
                navigate("./view/" + params.row.clientId);
                setOpenDialog((prev) => {
                  return {
                    ...prev,
                    open: true,
                    type: "view",
                    data: params.row,
                  };
                });
              }}
              className={`interact-main`}
            >
              <VisibilityIcon />
            </IconButton>
            {permissions.edit ? (
              <IconButton
                onClick={() => {
                  setSelectedRow(params.row.id);
                  navigate("./edit/" + params.row.clientId);
                  setOpenDialog((prev) => {
                    return {
                      ...prev,
                      open: true,
                      type: "edit",
                      data: params.row,
                    };
                  });
                }}
                className={`interact-main`}
              >
                <EditIcon />
              </IconButton>
            ) : null}
            {permissions.delete ? (
              <IconButton
                onClick={() => {
                  setSelectedRow(params.row.id);
                  navigate("./delete/" + params.row.clientId);
                  setOpenDialog((prev) => {
                    return {
                      ...prev,
                      open: true,
                      type: "delete",
                      data: params.row,
                    };
                  });
                }}
                className={`interact-main`}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </Box>
        ),
        disableExport: true,
      },
    ],
    rows: [],
  });

  useMemo(() => {
    if (clients.clients) {
      setTable((prev) => {
        return {
          ...prev,
          rows: JSON.parse(
            JSON.stringify(clients.clients).replace(/:null/gi, ':""')
          ),
        };
      });
    }
  }, [clients.clients]);

  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: "",
    data: {},
  });

  useEffect(() => {
    if (match)
      window.addEventListener("popstate", () => {
        setOpenDialog((prev) => {
          if (prev.open)
            return {
              ...prev,
              open: false,
              type: "",
            };
          return prev;
        });
      });

    if (!["new", "edit", "view", "delete"].includes(openDialog?.type)) {
      if (!match && !openDialog?.open) {
        navigate(".", { replace: true });
      }
      if (match && openDialog?.open) {
        setOpenDialog((prev) => {
          return {
            ...prev,
            open: !prev.open,
            type: "",
          };
        });
      }
    }
    return () => {
      window.removeEventListener("popstate", () => {});
    };
  }, [match, openDialog, navigate]);

  const [selectedRow, setSelectedRow] = useState();

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedRow(Number(event.currentTarget.getAttribute("data-id")));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const openView = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        // console.log(row);
        navigate("./view/" + row.clientId);
        setOpenDialog((prev) => {
          return { ...prev, open: true, type: "view", data: row };
        });
      }
      return row;
    });
    handleClose();
  };

  const openEdit = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate("./edit/" + row.clientId);
        setOpenDialog((prev) => {
          return { ...prev, open: true, type: "edit", data: row };
        });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate("./delete/" + row.clientId);
        setOpenDialog((prev) => {
          return { ...prev, open: true, type: "delete", data: row };
        });
      }
      return row;
    });
    handleClose();
  };

  const hiddenFields = [
    "id",
    "firstName",
    "lastName",
    "options",
    !["Admin", "Coordinator"]?.includes(user.user.role) && [
      "clientId",
      "carers",
    ],
  ];

  const columnVisibility = () => {
    const userSettings = JSON.parse(
      localStorage.getItem("clientColumnVisibility")
    );
    const defaultSettings = {
      // Hides listed coloumns
      id: false,
      clientId: false,
      firstName: false,
      lastName: false,
      carers: false,
    };
    // console.log(userSettings, defaultSettings);
    return userSettings || defaultSettings;
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col ">
      <Backdrop
        open={clients.status === "loading"}
        className={`z-40`}
        name="clientBackdrop"
      >
        <CircularProgress />
      </Backdrop>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog?.open}
        className={`z-30 max-w-full`}
        disablePortal
        classes={{
          paper: "dialog-background",
        }}
      >
        <Suspense
          fallback={
            <Backdrop open={true} className={`z-40`}>
              <CircularProgress />
            </Backdrop>
          }
        >
          <Outlet context={{ openDialog, setOpenDialog, fullScreen }} />
        </Suspense>
      </Dialog>
      <Typography
        variant="h3"
        component="div"
        className={`py-4 text-psl-primary dark:text-psl-active-text`}
      >
        Clients
      </Typography>
      <GeneralDataGrid
        functions={{ setSelectedRow, handleContextMenu, setOpenDialog }}
        variables={{
          table,
          selectedRow,
          permissions,
          initialState: {
            columns: {
              columnVisibilityModel: columnVisibility(),
            },
            sorting: {
              sortModel: [
                {
                  field: "id",
                  sort: "desc",
                },
              ],
            },
          },
          settings: {
            type: "client",
            button: "New Client",
          },
          hiddenFields,
        }}
      />
      <DataGridMenu
        functions={{ handleClose, openView, openEdit, openDelete }}
        variables={{ contextMenu, permissions, array: clients.clients }}
      />
    </div>
  );
};

export default memo(Clients);
