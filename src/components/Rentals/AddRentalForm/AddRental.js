import React, { Fragment, useEffect, useState } from "react";

import validateForm from "./validateForm.js";

import countVehiclePrice from "./countVehiclePrice";

import {
  Popconfirm,
  Card,
  Select,
  TimePicker,
  Steps,
  Button,
  message,
  Switch,
  Checkbox,
  Radio,
  Input,
  Tabs,
  List,
  Tag,
} from "antd";

import moment from "moment";

import classes from "./AddRental.module.css";

const { Step } = Steps;
const { TabPane } = Tabs;

const AddRental = (props) => {
  const [liability, setLiability] = useState();
  const [formData, setFormData] = useState({
    current: 0,
    lastName: "",
    firstName: "",
    pesel: "",
    peselSelected: true,
    idNumber: "",
    country: "",
    streetAndNumber: "",
    location: "",
    postcode: "",
    addressSelected: false,
    email: "",
    countryCode: "",
    phone: "",
    vehicles: [],
    hours: "00:00",
    days: 0,
    interval: "Hours",
    payments: [{ type: "prepayment", amount: 0 }],
    liability: 0,
  });

  useEffect(() => {
    setLiability(
      formData.vehicles
        .map((vehicle) => {
          console.log(
            "Vehicle: ",
            vehicle,
            "Vehicles : ",
            props.vehicles,
            "Prices: ",
            props.prices,
            "Form Data: ",
            formData
          );
          return countVehiclePrice(
            vehicle,
            props.vehicles,
            props.prices,
            formData
          );
        })
        .reduce((partialSum, a) => partialSum + a, 0)
    );
  }, [props.vehicles, props.prices, formData]);

  const firstNameChangeHandler = (event) => {
    setFormData({ ...formData, firstName: event.target.value });
  };

  const lastNameChangeHandler = (event) => {
    setFormData({ ...formData, lastName: event.target.value });
  };

  const peselChangeHandler = (event) => {
    setFormData({ ...formData, pesel: event.target.value });
  };

  const idNumberChangeHandler = (event) => {
    setFormData({ ...formData, idNumber: event.target.value });
  };

  const countryChangeHandler = (event) => {
    setFormData({ ...formData, country: event.target.value });
  };

  const streetAndNumberChangeHandler = (event) => {
    setFormData({ ...formData, streetAndNumber: event.target.value });
  };

  const locationChangeHandler = (event) => {
    setFormData({ ...formData, location: event.target.value });
  };

  const postcodeChangeHandler = (event) => {
    setFormData({ ...formData, postcode: event.target.value });
  };

  const emailChangeHandler = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const countryCodeChangeHandler = (event) => {
    setFormData({ ...formData, countryCode: event.target.value });
  };

  const phoneChangeHandler = (event) => {
    setFormData({ ...formData, phone: event.target.value });
  };

  const vehiclesChangeHandler = (event) => {
    setFormData({ ...formData, vehicles: event });
  };

  const hoursChangeHandler = (time, timeString) => {
    setFormData({ ...formData, hours: timeString });
  };

  const prepaymentChangeHandler = (event) => {
    setFormData({
      ...formData,
      payments: [
        {
          type: "prepayment",
          amount: event.target.value,
          rentalpoint: props.rentalpoint,
        },
      ],
      liabilities: [
        {
          type: "prepayment",
          amount: liability,
          rentalpoint: props.rentalpoint,
        },
      ],
    });
  };

  const daysChangeHandler = (event) => {
    setFormData({ ...formData, days: event });
  };

  const peselChange = (event) => {
    setFormData({ ...formData, peselSelected: event });
  };

  const addressChange = (event) => {
    setFormData({ ...formData, addressSelected: event.target.checked });
  };

  const intervalChange = (event) => {
    event.target.value === "Hours" && setFormData({ ...formData, days: 0 });
    event.target.value === "Days" &&
      setFormData({ ...formData, hours: "00:00" });
    setFormData({ ...formData, interval: event.target.value });
  };

  const next = () => {
    let validated = validateForm(formData);
    if (validated.length === 0) {
      // if (true) {
      setFormData({ ...formData, current: formData.current + 1 });
    } else {
      message.error(validated.map((valid) => <p>{valid.message}</p>));
    }
    validated = [];
  };

  const prev = () => {
    setFormData({ ...formData, current: formData.current - 1 });
  };

  const addRentalHandler = () => {
    let validated = validateForm(formData);
    if (validated.length === 0) {
      props.onAddRental(formData);
      setFormData({
        current: 0,
        lastName: "",
        firstName: "",
        pesel: "",
        peselSelected: true,
        idNumber: "",
        country: "",
        streetAndNumber: "",
        location: "",
        postcode: "",
        addressSelected: false,
        email: "",
        countryCode: "",
        phone: "",
        vehicles: [],
        hours: "00:00",
        days: 0,
        interval: "Hours",
        payments: [
          { type: "prepayment", amount: 0, rentalpoint: props.rentalpoint },
        ],
      });
    } else {
      message.error(validated.map((valid) => <p>{valid.message}</p>));
    }
    validated = [];
  };

  const personalData = (
    <Fragment>
      <div className={classes["control-group"]}>
        <div className={classes["form-control"]}>
          <label htmlFor="firstName">First Name</label>
          <Input
            onChange={firstNameChangeHandler}
            value={formData.firstName}
            type={"text"}
            id={"firstName"}
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="lastName">Last Name</label>
          <Input
            onChange={lastNameChangeHandler}
            value={formData.lastName}
            type={"text"}
            id={"lastName"}
          />
        </div>
      </div>
      <Switch
        onChange={peselChange}
        checked={formData.peselSelected}
        checkedChildren="PESEL"
        unCheckedChildren="ID Number"
        defaultChecked
      />
      {formData.peselSelected && (
        <div className={classes["control-group"]}>
          <div className={classes["form-control"]}>
            <label htmlFor="pesel">PESEL</label>
            <Input
              onChange={peselChangeHandler}
              value={formData.pesel}
              type={"text"}
              id={"pesel"}
            />
          </div>
        </div>
      )}
      {!formData.peselSelected && (
        <div className={classes["control-group"]}>
          <div className={classes["form-control"]}>
            <label htmlFor="idNumber">ID Number</label>
            <Input
              onChange={idNumberChangeHandler}
              value={formData.idNumber}
              type={"text"}
              id={"idNumber"}
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="country">Country</label>
            <Input
              onChange={countryChangeHandler}
              value={formData.country}
              type={"text"}
              id={"country"}
            />
          </div>
        </div>
      )}
      <Checkbox checked={formData.addressSelected} onChange={addressChange}>
        Enter Address
      </Checkbox>
      {formData.addressSelected && (
        <div className={classes["control-group"]}>
          <div className={classes["form-control"]}>
            <label htmlFor="streetAndNumber">Street and Number</label>
            <Input
              onChange={streetAndNumberChangeHandler}
              value={formData.streetAndNumber}
              type={"text"}
              id={"streetAndNumber"}
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="location">Location</label>
            <Input
              onChange={locationChangeHandler}
              value={formData.location}
              type={"text"}
              id={"location"}
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="postcode">Post Code</label>
            <Input
              onChange={postcodeChangeHandler}
              value={formData.postcode}
              type={"text"}
              id={"postcode"}
            />
          </div>
        </div>
      )}
    </Fragment>
  );

  const contactData = (
    <Fragment>
      <div className={classes["control-group"]}>
        <div className={classes["form-control"]}>
          <label htmlFor="email">E-Mail Address</label>
          <Input
            onChange={emailChangeHandler}
            value={formData.email}
            type={"email"}
            id={"email"}
          />
        </div>
      </div>
      <div className={classes["control-group"]}>
        <div className={classes["form-control"]}>
          <label htmlFor="countryCode">Country Code</label>
          <Input
            onChange={countryCodeChangeHandler}
            value={formData.countryCode}
            type={"text"}
            id={"countryCode"}
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="phone">Phone Number</label>
          <Input
            onChange={phoneChangeHandler}
            value={formData.phone}
            type={"text"}
            id={"phone"}
          />
        </div>
      </div>
    </Fragment>
  );

  const duration = [
    { label: "Hours", value: "Hours" },
    { label: "Days", value: "Days" },
    { label: "Today", value: "Today" },
    { label: "30min", value: "30min" },
  ];

  const createDays = () => {
    const days = [];
    for (let i = 1; i <= 20; i++) {
      days.push({ label: i, value: i });
    }
    return days;
  };

  const rentalData = (
    <Fragment>
      <div className={`${classes["form-control"]}`}>
        <label htmlFor="vehicles">Vehicles</label>
        <Select
          id="vehicles"
          mode="multiple"
          allowClear
          className={`${classes["custom-select"]}`}
          placeholder="Please select a vehicle"
          onChange={vehiclesChangeHandler}
          options={
            props.rentalpoint &&
            props.vehicles
              .filter(
                (vehicle) =>
                  vehicle.rentalpoint === props.rentalpoint &&
                  vehicle.readytouse &&
                  !vehicle.rented
              )
              .map((vehicle) => ({
                key: vehicle.vehicleid,
                value: vehicle.vehicleid,
              }))
          }
        />
      </div>
      <div className={classes["form-control"]}>
        <Radio.Group
          options={duration}
          onChange={intervalChange}
          value={formData.interval}
          optionType="button"
        />
        {formData.interval === "Hours" && (
          <Fragment>
            <label htmlFor="fromDate">Duration hours</label>
            <TimePicker
              onChange={hoursChangeHandler}
              defaultValue={moment(formData.hours, "HH")}
              placeholder="Choose duration hours"
              showNow={false}
              format={"HH"}
            />
          </Fragment>
        )}
        {formData.interval === "Days" && (
          <Fragment>
            <label htmlFor="fromDate">Duration days</label>
            <Select
              defaultValue={formData.days}
              options={createDays()}
              style={{ width: 120 }}
              onChange={daysChangeHandler}
            />
          </Fragment>
        )}
      </div>
    </Fragment>
  );

  const summaryData = {
    cost: [{ label: "vehicles", value: formData.vehicles }],
    personal: [
      { label: "First Name", value: formData.firstName },
      { label: "Last Name", value: formData.lastName },
      { label: "PESEL", value: formData.pesel },
      { label: "ID Number", value: formData.idNumber },
      { label: "Country", value: formData.country },
    ],
    contact: [
      { label: "Street", value: formData.streetAndNumber },
      { label: "Postcode", value: formData.postcode },
      { label: "Location", value: formData.location },
      { label: "Phone", value: `${formData.countryCode} ${formData.phone}` },
      { label: "Email", value: `${formData.email}` },
    ],
    rental: [
      {
        label: "Vehicles",
        value: formData.vehicles.map((vehicle) => (
          <Tag key={vehicle}>{vehicle}</Tag>
        )),
      },
      { label: "Hours", value: formData.hours },
      { label: "Days", value: formData.days },
      { label: "Today", value: "Whole day" },
      { label: "30min", value: "Half hour" },
    ],
  };

  const summary = (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Rental Cost" key="1">
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={summaryData.cost}
          renderItem={(item) => (
            <List.Item>
              <Card title="Vehicles">
                <List>
                  {item.value.map((vehicle) => (
                    <List.Item key={vehicle}>
                      {vehicle} -{" "}
                      {countVehiclePrice(
                        vehicle,
                        props.vehicles,
                        props.prices,
                        formData
                      )}{" "}
                      PLN
                    </List.Item>
                  ))}
                </List>
              </Card>
              <Card>
                <b>
                  Sum:
                  <div style={{ border: "3px solid red" }}>
                    {item.value
                      .map((vehicle) =>
                        countVehiclePrice(
                          vehicle,
                          props.vehicles,
                          props.prices,
                          formData
                        )
                      )
                      .reduce((partialSum, a) => partialSum + a, 0)}{" "}
                    PLN
                  </div>
                </b>
              </Card>
              <Card>
                <div className={classes["control-group"]}>
                  <div className={classes["form-control"]}>
                    <label htmlFor="email">Payment amount</label>
                    <Input
                      onChange={prepaymentChangeHandler}
                      value={formData.payments[0].amount}
                      type={"text"}
                      id={"prepayment"}
                    />
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </TabPane>
      <TabPane tab="Rental Data" key="2">
        <List
          size="small"
          bordered
          dataSource={summaryData.rental}
          renderItem={(item) => {
            if (item.label === formData.interval || item.label === "Vehicles") {
              return (
                <List.Item>
                  <b>{item.label}</b>: <Tag>{item.value}</Tag>
                </List.Item>
              );
            }
          }}
        />
      </TabPane>
      <TabPane tab="Personal Data" key="3">
        <List
          size="small"
          bordered
          dataSource={summaryData.personal}
          renderItem={(item) =>
            item.value && (
              <List.Item>
                <b>{item.label}</b>: <Tag>{item.value}</Tag>
              </List.Item>
            )
          }
        />
      </TabPane>
      <TabPane tab="Contact" key="4">
        <List
          size="small"
          bordered
          dataSource={summaryData.contact}
          renderItem={(item) =>
            item.value && (
              <List.Item>
                <b>{item.label}</b>: <Tag>{item.value}</Tag>
              </List.Item>
            )
          }
        />
      </TabPane>
    </Tabs>
  );

  const steps = [
    {
      title: "Personal Data",
      content: personalData,
    },
    {
      title: "Contact",
      content: contactData,
    },
    {
      title: "Rental Data",
      content: rentalData,
    },
    {
      title: "Summary",
      content: summary,
    },
  ];

  return (
    <Card style={{ marginBottom: "0.5em", marginTop: "0.5em" }}>
      <Steps current={formData.current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className={classes["steps-content"]}>
        {steps[formData.current].content}
      </div>
      <div className={classes["steps-action"]}>
        {formData.current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {formData.current === steps.length - 1 && (
          <Popconfirm
            title="Are you sure to create the rental?"
            onConfirm={addRentalHandler}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Done</Button>
          </Popconfirm>
        )}
        {formData.current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AddRental;
