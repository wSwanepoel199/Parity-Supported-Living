import { ClickAwayListener, Paper, Popper } from "@mui/material";
import { useGridApiContext, } from "@mui/x-data-grid";
import { isEscapeKey } from "@mui/x-data-grid/utils/keyboardUtils";
import React, { forwardRef, useCallback, useMemo, useState } from "react";


const CustomDataGridPanel = forwardRef(
  function CustomDataGridPanel(props, ref) {
    const {
      children,
      ...other
    } = props;
    const apiRef = useGridApiContext();
    const [isPlaced, setIsPlaced] = useState(false);

    const handleClickAway = useCallback(() => {
      apiRef.current.hidePreferences();
    }, [apiRef]);

    const handleKeyDown = useCallback((event) => {
      if (isEscapeKey(event.key)) {
        apiRef.current.hidePreferences();
      }
    }, [apiRef]);

    const modifiers = useMemo(() => {
      return [
        {
          name: 'flip',
          enabled: false,
        },
        {
          name: 'isPlaced',
          enabled: true,
          phase: 'main',
          fn: () => {
            setIsPlaced(true);
          },
          effect: () => () => {
            setIsPlaced(false);
          },
        },
      ];
    }, []);

    return (
      <Popper
        slot='Panel'
        ref={ref}
        placement="bottom-start"
        className="z-10"
        modifiers={modifiers}
        {...other}
      >
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={handleClickAway}>
          <Paper className="dialog-background rounded-md" onKeyDown={handleKeyDown}>
            {isPlaced && children}
          </Paper>
        </ClickAwayListener>
      </Popper>
    );
  });

export { CustomDataGridPanel };