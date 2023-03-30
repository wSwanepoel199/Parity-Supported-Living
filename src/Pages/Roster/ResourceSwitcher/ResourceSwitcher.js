import { MenuItem, Select, Typography } from "@mui/material";

function ResourceSwitcher({ mainResourceName, onChange, resources }) {
  return (
    <div className={`flex mb-2 justify-end`}>
      <Typography variant="h6" component='div' className={`mr-2`}>
        Viewing:
      </Typography>
      <Select
        variant="standard"
        value={mainResourceName}
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