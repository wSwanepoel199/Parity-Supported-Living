import React, { useRef, useState } from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const DataGridMenu = ({ functions, variables }) => {
  const menu = useRef();
  const { handleClose, openView, openEdit, openDelete } = functions;
  const { contextMenu, permissions, array } = variables;
  const [hover, setHover] = useState();


  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
      disablePortal
      slotProps={{
        root: {
          onContextMenu: (e) => {
            e.preventDefault();
            handleClose();
          },
        },
      }}
      PopoverClasses={{
        paper: 'bg-inherit'
      }}
      MenuListProps={{
        className: 'dark:bg-psl-primary bg-psl-active-text',

      }}
    >
      <MenuItem
        id="view"
        onClick={() => openView(array)}
        onMouseEnter={(e) => {
          menu.current = e;
          setHover(e);
        }}
        onMouseLeave={() => {
          menu.current = null;
          setHover(undefined);
        }}
      >
        <ListItemIcon
          className={`
          ${hover?.target.id === 'view' ? `
          text-psl-active-link`: `
          text-psl-primary-text
          dark:text-psl-active-text 
          `}`}>
          <VisibilityIcon />
        </ListItemIcon>
        <ListItemText
          className={`
          ${hover?.target.id === 'view' ? `
          text-psl-active-link`: `
          text-psl-primary-text
          dark:text-psl-active-text 
          `}`}>
          View
        </ListItemText>
      </MenuItem>
      {permissions.edit ?
        <MenuItem
          id='edit'
          onClick={() => openEdit(array)}
          onMouseEnter={(e) => {
            menu.current = e;
            setHover(e);
          }}
          onMouseLeave={() => {
            menu.current = null;
            setHover(undefined);
          }}
        >
          <ListItemIcon className={`
          ${hover?.target.id === 'edit' ? `
          text-psl-active-link`: `
          text-psl-primary-text
          dark:text-psl-active-text 
          `}`}>
            <EditIcon />
          </ListItemIcon>
          <ListItemText className={`
          ${hover?.target.id === 'edit' ? `
          text-psl-active-link`: `
          text-psl-primary-text
          dark:text-psl-active-text 
          `}`}>
            Edit
          </ListItemText>
        </MenuItem> : null}
      {permissions.delete ?
        <MenuItem
          id="delete"
          onClick={() => openDelete(array)}
          onMouseEnter={(e) => {
            menu.current = e;
            setHover(e);
          }}
          onMouseLeave={() => {
            menu.current = null;
            setHover(undefined);
          }}
        >
          <ListItemIcon className={`
          ${hover?.target.id === 'delete' ? `
          text-psl-active-link`: `
          text-psl-primary-text
          dark:text-psl-active-text 
          `}`}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText className={`
          ${hover?.target.id === 'delete' ? `
          text-psl-active-link`: `
          text-psl-primary-text
          dark:text-psl-active-text
          `}`}>
            Delete
          </ListItemText>
        </MenuItem> : null}
    </Menu>
  );
};

export default DataGridMenu;