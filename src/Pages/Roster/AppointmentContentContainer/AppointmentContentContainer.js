import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

export default function AppointmentContent({ data, formatDate, ...props }) {

  return (
    <Appointments.AppointmentContent {...props} formatDate={formatDate} data={data}>
      {console.log(data)}
      <div className={`w-full`}>
        <div className={`font-bold overflow-hidden text-ellipsis whitespace-nowrap`}>
          {data.title}
        </div>
        <div className={`overflow-hidden text-ellipsis whitespace-nowrap`}>
          {data.location}
        </div>
        <div className={`leading-none whitespace-pre-wrap overflow-hidden text-ellipsis w-full mt-1`}>
          <div className={`inline-block overflow-hidden text-ellipsis`}>
            {formatDate(data.startDate, { hour: 'numeric', minute: 'numeric' })}
          </div>
          <div className={`inline-block overflow-hidden text-ellipsis`}>
            {' - '}
          </div>
          <div className={`inline-block overflow-hidden text-ellipsis`}>
            {formatDate(data.endDate, { hour: 'numeric', minute: 'numeric' })}
          </div>
        </div>
        <div className={`leading-none whitespace-pre-wrap overflow-hidden text-ellipsis w-full mt-1`}>
          <div className={`inline-block overflow-hidden text-ellipsis`}>
            {data.carer?.name}
          </div>
          <div className={`inline-block overflow-hidden text-ellipsis`}>
            {data.client?.name}
          </div>
        </div>
      </div>
    </Appointments.AppointmentContent>
  );
}