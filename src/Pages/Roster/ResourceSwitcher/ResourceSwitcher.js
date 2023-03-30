import { MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function ResourceSwitcher({ mainResourceName, onChange, resources }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <div className={`flex  justify-end items-center px-2 py-[6px]`}>
      {!mobile ? <Typography variant="h6" component='div' className={`mr-2`}>
        Viewing:
      </Typography> : null}
      <Select
        variant="outlined"
        value={mainResourceName}
        inputProps={{
          className: `py-2`
        }}
        onChange={e => onChange(e.target.value)}
      >
        {resources.map(resource => (
          <MenuItem key={resource.fieldName} value={resource.fieldName}>
            {resource.title}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default ResourceSwitcher;