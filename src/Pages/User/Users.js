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
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useMatch, useNavigate } from "react-router-dom";

import { DataGridMenu, GeneralDataGrid } from "../../Components";
import { selectUsers } from "../../Redux/admin/adminSlice";
import { selectUser } from "../../Redux/user/userSlice";

const Users = () => {
  const admin = useSelector(selectUsers);
  const user = useSelector(selectUser);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const match = useMatch("/users");

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
        field: "userId",
        filterable: false,
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        width: 95,
        valueGetter: ({ row }) => {
          return row.role || null;
        },
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
          <p
            className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
          >
            {value}
          </p>
        ),
      },
      {
        field: "clientsName",
        headerName: "Clients",
        disableExport: true,
        flex: 2,
        minWidth: 100,
        valueGetter: ({ row }) => {
          const clients = row.clients
            .map((clients) => `${clients.firstName} ${clients?.lastName}`)
            .join(", ");
          return clients || null;
        },
        renderCell: (params) => {
          const clients = params.row.clients
            .map((clients) => `${clients.firstName} ${clients?.lastName}`)
            .join(", ");
          return (
            <Box
              className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}
            >
              {clients}
            </Box>
          );
        },
      },
      {
        field: "clients",
        headerName: "clientId",
        disableColumnMenu: true,
        filterable: false,
        flex: 1,
        valueFormatter: (params) => {
          return params.value.map((client) => client.clientId).join(", ");
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
                navigate("./view/" + params.row.userId);
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
                  navigate("./edit/" + params.row.userId);
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
                  navigate("./delete/" + params.row.userId);
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
    if (admin.users) {
      setTable((prev) => {
        return {
          ...prev,
          rows: JSON.parse(
            JSON.stringify(admin.users).replace(/:null/gi, ':""')
          ),
        };
      });
    }
  }, [admin.users]);

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

  // useMemo(() => {
  //   if (match && openDialog.open && !["new", "edit", "view", "delete"].includes(openDialog.type)) {
  //     setOpenDialog({
  //       ...openDialog,
  //       open: !openDialog.open
  //     });
  //   }
  // }, [match, openDialog]);

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
        navigate("./view/" + row.userId);
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
        navigate("./edit/" + row.userId);
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
        navigate("./delete/" + row.userId);
        setOpenDialog((prev) => {
          return { ...prev, open: true, type: "delete", data: row };
        });
      }
      return row;
    });
    handleClose();
  };

  const hiddenFields = ["id", "firstName", "lastName", "options"];

  const columnVisibility = () => {
    const userSettings = JSON.parse(
      localStorage.getItem("userColumnVisibility")
    );
    const defaultSettings = {
      // Hides listed coloumns
      id: false,
      userId: false,
      firstName: false,
      lastName: false,
      clients: false,
    };
    // console.log(userSettings, defaultSettings);
    return userSettings || defaultSettings;
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col ">
      <Backdrop open={admin.status === "loading"} className={`z-40`}>
        <CircularProgress />
      </Backdrop>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        className={`z-30 max-w-full`}
        disablePortal
        classes={{
          paper: "dialog-background",
        }}
      >
        <Outlet context={{ openDialog, setOpenDialog, fullScreen }} />
      </Dialog>
      <Typography
        variant="h3"
        component="div"
        className={`py-4 text-psl-primary dark:text-psl-active-text`}
      >
        Users
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
            type: "user",
            button: "New User",
          },
          hiddenFields,
        }}
      />
      <DataGridMenu
        functions={{ handleClose, openView, openEdit, openDelete }}
        variables={{ contextMenu, permissions, array: admin.users }}
      />
    </div>
  );
};

export default memo(Users);
