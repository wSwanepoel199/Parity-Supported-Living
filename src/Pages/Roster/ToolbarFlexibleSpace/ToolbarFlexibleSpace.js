import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";


const FlexibleSpace = (({ props, children }) => {
  return (
    <Toolbar.FlexibleSpace {...props} style={{
      display: 'flex',
      justifyContent: 'end',
      alignItems: "center"
    }} >
      {children}
    </Toolbar.FlexibleSpace>
  );
}
);

export default FlexibleSpace;