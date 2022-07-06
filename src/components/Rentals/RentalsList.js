import React, { useState } from "react";
import Rental from "./Rental";
import { Space, Button, Form, Input, Select, Collapse } from "antd";
import { isSameDay } from "date-fns";

const sortFunction = (a, b) => {
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.props.rental.timestamp) - new Date(a.props.rental.timestamp);
};

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const RentalsList = (props) => {
  const [form] = Form.useForm();
  const [nameFilter, setNameFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  const { rentalpoint, rentalsList, vehicles, changeVehicles, completeRental, updateRental, deleteRental } = props;
  const { Panel } = Collapse;

  const onFinish = (values) => {
    values.vehicle && setVehicleFilter(values.vehicle);
    values.clientName && setNameFilter(values.clientName);
  };

  const resetFunction = () => {
    setVehicleFilter("");
    setNameFilter("");
    form.resetFields();
  };

  const onReset = () => {
    resetFunction();
  };

  const onCollapseChange = (key) => {
    resetFunction();
  };

  const vehiclesList =
    vehicles &&
    vehicles.map((vehicle) => {
      return (
        <Option key={vehicle.vehicleid} value={vehicle.vehicleid}>
          {vehicle.vehicleid}
        </Option>
      );
    });

  const FilterComponent = (
    <Collapse defaultActiveKey={[""]} onChange={onCollapseChange}>
      <Panel header="Rental list filter" key="1">
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="clientName"
            label="Client name"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vehicle"
            label="Vehicle"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select showSearch placeholder="Select a vehicle" allowClear>
              {vehiclesList}
            </Select>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}>
            {({ getFieldValue }) =>
              getFieldValue("gender") === "other" ? (
                <Form.Item
                  name="customizeGender"
                  label="Customize Gender"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  );

  const filterFunction = (rental) => {
    const currentDate = new Date();
    const rentalDate = new Date(rental.startRentalTime);

    if (vehicleFilter.length > 0 && nameFilter.length < 1) {
      console.log("hello");
      return (
        rental.vehicles.filter((vehicle) => vehicle.vehicleid === vehicleFilter).length > 0 &&
        rental.rentalpoint /* && isSameDay(currentDate, rentalDate) */
      );
    } else if (vehicleFilter.length < 1 && nameFilter.length > 0) {
      return (
        rental.firstName.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 ||
        rental.lastName.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 /* && isSameDay(currentDate, rentalDate) */
      );
    } else if (vehicleFilter.length > 0 && nameFilter.length > 0) {
      return (
        isSameDay(currentDate, rentalDate) &&
        rental.vehicles.filter((vehicle) => vehicle.vehicleid === vehicleFilter).length > 0 &&
        (rental.firstName.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 ||
          rental.lastName.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) /* && isSameDay(currentDate, rentalDate) */
      );
    } else {
      return rentalpoint === rental.rentalpoint /* && rental.rented === true */;
    }
  };

  const RentalComponent = rentalsList
    .filter(filterFunction)
    .map((rental) => (
      <Rental
        changeVehicles={changeVehicles}
        completeRental={completeRental}
        key={rental.id}
        rental={rental}
        updateRental={updateRental}
        deleteRental={deleteRental}
      />
    ))
    .sort(sortFunction);

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {FilterComponent}
      {RentalComponent}
    </Space>
  );
};

export default RentalsList;
