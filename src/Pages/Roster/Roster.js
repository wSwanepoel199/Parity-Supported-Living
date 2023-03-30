import { Paper, Typography } from "@mui/material";
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

  // const currentDate = new Date();

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col">
      <Typography variant="h3" component="div" className={`py-5`}>Roster</Typography>
      <ResourceSwitcher
        resources={data.resources}
        mainResourceName={data.mainResourceName}
        onChange={changeMainResource}
      />
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
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <Appointments />
          <AppointmentTooltip />
          <Resources
            data={data.resources}
            mainResourceName={data.mainResourceName}
          />
        </Scheduler>
      </Paper>
      <pre>
        {JSON.stringify(data, null, 2)}
        {console.log(data)}
      </pre>
    </div>
  );
}

export default Roster;