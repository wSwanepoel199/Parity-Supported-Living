import { ViewSwitcher } from "@devexpress/dx-react-scheduler-material-ui";
import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";


function CustomViewSwitcher(props) {
  console.log(props);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className={`flex  justify-end items-center px-2 py-[6px]`}>
      {!mobile ? <Typography variant="h6" component='div' className={`mr-2`}>
        Scope:
      </Typography> : null}
      <ViewSwitcher.Switcher {...props} />
    </div>
  );
}

export default CustomViewSwitcher;