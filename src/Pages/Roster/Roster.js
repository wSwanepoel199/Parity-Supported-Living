import { LinearProgress, Paper, Typography } from "@mui/material";
import {
  EditingState,
  IntegratedEditing,
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
  Resources,
  ConfirmationDialog,
  AppointmentForm
} from '@devexpress/dx-react-scheduler-material-ui';
import { useEffect, useState } from "react";

import { data as appointments } from './appointments';
import ResourceSwitcher from "./ResourceSwitcher/ResourceSwitcher";
import { useSelector } from "react-redux";
import AppointmentContent from "./AppointmentContentContainer/AppointmentContentContainer";
import FlexibleSpace from "./ToolbarFlexibleSpace/ToolbarFlexibleSpace";
import CustomViewSwitcher from "./ViewSwitcher/ViewSwitcher";

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
    if (admin.users?.length > 0 && !["carerId"].includes(data.resources.fieldName)) {
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
    if (clients.clients?.length > 0 && !["clientId"].includes(data.resources.fieldName)) {
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
    console.log(newResourceName);
    setData(prev => {
      return {
        ...prev,
        mainResourceName: newResourceName
      };
    });
  }

  function commitChanges({ added, changed, deleted }) {
    setData((prev) => {
      let { appointments } = prev;
      if (added) {
        const startingAddedId = appointments.length > 0 ? appointments[appointments.length - 1].id + 1 : 0;
        appointments = [...appointments, { id: startingAddedId, ...added }];
      }
      if (changed) {
        appointments = appointments.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        appointments = appointments.filter(appointment => appointment.id !== deleted);
      }

      return {
        ...prev,
        appointments
      };
    });
  };

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
          <EditingState
            onCommitChanges={commitChanges}
          />
          <IntegratedEditing />
          <DayView
            startDayHour={8}
            endDayHour={20}
          />
          <WeekView
            startDayHour={9}
            endDayHour={20}
          />
          <MonthView />
          <ConfirmationDialog />
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
          <ViewSwitcher
            switcherComponent={(props) => (<CustomViewSwitcher
              {...props} />)}
          />
          {/* <TodayButton /> */}
          <Appointments
            appointmentContentComponent={AppointmentContent}
          />
          <AppointmentTooltip />
          <AppointmentForm />
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