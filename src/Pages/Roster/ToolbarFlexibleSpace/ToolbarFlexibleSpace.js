import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";


export default function FlexibleSpace({ props, children }) {
  return (
    <Toolbar.FlexibleSpace {...props} className={`mr-auto m-0 flex justify-start items-center`} style={{ marginLeft: 0 }} >
      {children}
    </Toolbar.FlexibleSpace>
  );
} 