import { Table } from "antd";
import { format } from "date-fns";
import countVehiclePrice3 from "./countVehiclePrice3";

const VehicleHistory = (props) => {
  const { vehicles, allVehicles, prices, currentTime, startRentalTime } = props;
  const vehicleColumns = [
    {
      title: "Vehicle Id",
      dataIndex: "vehicleid",
      key: "vehicleid",
    },
    {
      title: "Start",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
  ];

  const vehicleSource = vehicles.map((vehicle, index) => {
    /* Test */
    const startDateTime = "2022-06-19T11:20:00.901Z";
    let rentalStartTime = "2022-06-19T11:20:00.901Z";
    const endDateTime = "2022-06-19T21:28:00.901Z";
    rentalStartTime = new Date(rentalStartTime);
    /*******************************************/

    const startTime = format(new Date(vehicle.startDateTime), "dd.MM.yyyy - HH:mm:ss");
    // const startTime = format(new Date(startDateTime), "dd.MM.yyyy - HH:mm:ss");
    const endTime = vehicle.endDateTime ? format(new Date(vehicle.endDateTime), "dd.MM.yyyy - HH:mm:ss") : "";
    // const endTime = format(new Date(endDateTime), "dd.MM.yyyy - HH:mm:ss");
    const vehicleCost = countVehiclePrice3(vehicle, allVehicles, prices, startRentalTime, currentTime, vehicle.startDateTime, vehicle.endDateTime);
    // const vehicleCost = countVehiclePrice3(vehicle, allVehicles, prices, rentalStartTime, currentTime, startDateTime, endDateTime);

    return {
      key: index,
      vehicleid: vehicle.vehicleid,
      startTime,
      endTime,
      cost: Math.ceil(vehicleCost),
      // cost: vehicleCost,
    };
  });

  return <Table pagination={false} size="small" dataSource={vehicleSource} columns={vehicleColumns} />;
};

export default VehicleHistory;
