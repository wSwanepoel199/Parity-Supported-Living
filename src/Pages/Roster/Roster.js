import { LinearProgress, Paper, Typography } from "@mui/material";
import {
  ViewState,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  AppointmentTooltip,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  Resources
} from '@devexpress/dx-react-scheduler-material-ui';
import { useEffect, useState } from "react";

import { data as appointments } from './appointments';
import ResourceSwitcher from "./ResourceSwitcher/ResourceSwitcher";
import { useSelector } from "react-redux";
import AppointmentContent from "./AppointmentContentContainer/AppointmentContentContainer";
import FlexibleSpace from "./ToolbarFlexibleSpace/ToolbarFlexibleSpace";

function Roster() {
  const { admin, clients } = useSelector(state => {
    return {
      admin: state.admin,
      clients: state.clients
    };
  });
  const [data, setData] = useState({
    appointments: appointments,
    mainResourceName: 'all',
    resources: [
      {
        fieldName: 'all',
        title: "All",
        allowMultiple: true,
        instances: []
      }
    ],
  });

  useEffect(() => {
    if (admin.users?.length > 0) {
      setData(prev => {
        return {
          ...prev,
          resources: prev.resources.concat({
            fieldName: 'carerId',
            title: 'Carers',
            instances: admin.users.map(user => {
              return {
                id: user.userId,
                text: user.name,
                carer: user,
              };
            })
          })
        };
      });
    }
  }, [admin]);

  useEffect(() => {
    if (clients.clients?.length > 0) {
      setData(prev => {
        return {
          ...prev,
          resources: prev.resources.concat({
            fieldName: 'clientId',
            title: "Clients",
            instances: clients.clients.map(client => {
              return {
                id: client.clientId,
                text: client.name,
                client: client
              };
            })
          })
        };
      });
    }
  }, [clients]);

  function changeMainResource(newResourceName) {
    setData(prev => {
      return {
        ...prev,
        mainResourceName: newResourceName
      };
    });
  }

  const ToolbarWithLoading = (
    ({ children, ...props }) => (
      <div className={`relative`}>
        <Toolbar.Root {...props}>
          {children}
        </Toolbar.Root>
        <LinearProgress className={`absolute w-full bottom-0 left-0`} />
      </div>
    )
  );

  // const currentDate = new Date();

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col">
      <Typography variant="h3" component="div" className={`py-5`}>Roster</Typography>
      <Paper>
        <Scheduler
          data={data.appointments}
        >
          <ViewState
            defaultCurrentDate="2023-03-30"
            defaultCurrentViewName="Week"
          />
          <DayView
            startDayHour={8}
            endDayHour={20}
          />
          <WeekView
            startDayHour={9}
            endDayHour={20}
          />
          <MonthView />
          <Toolbar
            // rootComponent={ToolbarWithLoading}
            flexibleSpaceComponent={() => (<FlexibleSpace>
              <ResourceSwitcher
                resources={data.resources}
                mainResourceName={data.mainResourceName}
                onChange={changeMainResource}
              />
            </FlexibleSpace>)}
          />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <Appointments
            appointmentContentComponent={AppointmentContent}
          />
          <AppointmentTooltip />
          <Resources
            data={data.resources}
            mainResourceName={data.mainResourceName}
          />
        </Scheduler>
      </Paper>
      {/* <pre className={`max-w-full`}>
        {JSON.stringify(data, null, 2)}
        {console.log(data)}
      </pre> */}
    </div>
  );
}

export default Roster;