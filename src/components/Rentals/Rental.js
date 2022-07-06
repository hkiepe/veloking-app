import React from "react";

import { format } from "date-fns";
import { Card, Button, List, Tag, Space } from "antd";

const Rental = (props) => {
  const { id, rented, firstName, lastName, countryCode, phone, rentalpoint, vehicles, startRentalTime, endRentalTime } = props.rental;

  const rentalData = {
    header: [
      { label: "Id", value: id },
      { label: "Status", value: rented ? <Tag color="magenta">Rented</Tag> : <Tag color="green">Completed</Tag> },
    ],
    time: [
      { label: "Start Time", value: startRentalTime && format(new Date(startRentalTime), "dd.MM.yyyy - HH:mm:ss") },
      { label: "End Time", value: endRentalTime && format(new Date(endRentalTime), "dd.MM.yyyy - HH:mm:ss") },
    ],
    rental: [
      { label: "Rentalpoint", value: rentalpoint },
      {
        label: "Vehicles",
        value: rented
          ? vehicles.filter((vehicle) => !vehicle.returned).map((vehicle, index) => <Tag key={index}>{vehicle.vehicleid}</Tag>)
          : vehicles.map((vehicle, index) => <Tag key={index}>{vehicle.vehicleid}</Tag>),
      },
    ],
    personal: [
      { label: "First Name", value: firstName },
      { label: "Last Name", value: lastName },
    ],
    contact: [{ label: "Phone", value: `${countryCode} ${phone}` }],
  };

  return (
    <Card>
      <Space direction="vertical">
        <List
          size="small"
          bordered
          dataSource={rentalData.header}
          renderItem={(item) =>
            item.value && (
              <List.Item>
                <b>{item.label}</b>: <Tag>{item.value}</Tag>
              </List.Item>
            )
          }
        />
        <List
          size="small"
          bordered
          dataSource={rentalData.time}
          renderItem={(item) =>
            item.value && (
              <List.Item>
                <b>{item.label}</b>: <Tag>{item.value}</Tag>
              </List.Item>
            )
          }
        />

        <List
          size="small"
          bordered
          dataSource={rentalData.rental}
          renderItem={(item) =>
            item.value && (
              <List.Item>
                <b>{item.label}</b>: <Tag>{item.value}</Tag>
              </List.Item>
            )
          }
        />

        <List
          size="small"
          bordered
          dataSource={rentalData.personal}
          renderItem={(item) =>
            item.value && (
              <List.Item>
                <b>{item.label}</b>: <Tag>{item.value}</Tag>
              </List.Item>
            )
          }
        />

        <List
          size="small"
          bordered
          dataSource={rentalData.contact}
          renderItem={(item) =>
            item.value && (
              <List.Item>
                <b>{item.label}</b>: <Tag>{item.value}</Tag>
              </List.Item>
            )
          }
        />

        <Button
          onClick={() => {
            props.deleteRental(id, vehicles);
          }}
        >
          Delete Rental (For testing)
        </Button>
        <Button
          disabled={!rented}
          type="primary"
          onClick={() => {
            props.changeVehicles(id);
          }}
        >
          Change Vehicles
        </Button>
      </Space>
    </Card>
  );
};

export default Rental;
