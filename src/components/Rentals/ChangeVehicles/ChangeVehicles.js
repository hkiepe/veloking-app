import React, { useEffect, useState } from "react";
import { Button, List, Transfer, Space, Card, Input, Col, Row, Modal, message } from "antd";
import countVehiclePrice3 from "../VehicleHistory/countVehiclePrice3";
import { format, differenceInSeconds, addHours, addMinutes, addDays } from "date-fns";
import VehicleHistory from "../VehicleHistory/VehicleHistory";
import PaymentHistory from "../PaymentHistory/PaymentHistory";
import ConfirmRentalDialog from "./ConfirmRentalDialog";

const ChangeVehicles = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeDifference, setTimeDifference] = useState();
  const [amountToPay, setAmountToPay] = useState();
  const [startTime, setStartTime] = useState();
  const [expectedArrivalTime, setExpectedArrivalTime] = useState();
  const [targetKeys, setTargetKeys] = useState(props.rentalData.vehicles.filter((vehicle) => !vehicle.returned).map((vehicle) => vehicle.vehicleid));
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [vehiclesToAdd, setVehiclesToAdd] = useState([]);
  const [vehiclesToReturn, setVehiclesToReturn] = useState([]);
  const [modalConfirmRentalVisible, isModalConfirmRentalVisible] = useState(false);
  const [formData, setFormData] = useState({
    payments: [{ type: "Followup", amount: 0, rentalpoint: props.rentalpoint }],
  });

  const vehiclesSource = props.vehicles
    .filter((vehicle) => {
      console.log("vehicle", vehicle);
      if (
        props.rentalData.vehicles
          .filter((vehicle) => !vehicle.returned)
          .map((vehicle) => vehicle.vehicleid)
          .includes(vehicle.vehicleid)
      ) {
        return true;
      } else {
        return vehicle.rentalpoint === props.rentalpoint && vehicle.readytouse && !vehicle.rented;
      }
    })
    .map((vehicle) => {
      return { vehicleid: vehicle.vehicleid, key: vehicle.vehicleid };
    });

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const { vehicles, payments, startRentalTime } = props.rentalData;
  const { rentalData, prices } = props;
  const allVehicles = props.vehicles;

  useEffect(() => {
    setStartTime(new Date(startRentalTime));
    setVehiclesToAdd(
      vehiclesSource
        .map((vehicle) => vehicle.vehicleid)
        .filter(
          (vehicle) =>
            targetKeys.includes(vehicle) &&
            !props.rentalData.vehicles
              .filter((vehicle1) => !vehicle1.returned || typeof vehicle1.returned === "undefined")
              .map((vehicle2) => vehicle2.vehicleid)
              .includes(vehicle)
        )
    );
    setVehiclesToReturn(
      props.rentalData.vehicles
        .map((vehicle) => {
          return { vehicleid: vehicle.vehicleid, endDateTime: vehicle.endDateTime };
        })
        .filter((vehicle) => !targetKeys.includes(vehicle.vehicleid) && typeof vehicle.endDateTime === "undefined")
        .map((vehicle) => vehicle.vehicleid)
    );
    const interval = setInterval(() => {
      const newDateTime = new Date();
      setTimeDifference(differenceInSeconds(newDateTime, new Date(startRentalTime)));
      setCurrentTime(newDateTime);
      const price = rentalData.vehicles
        .map((vehicle) => {
          const vehiclePrice = countVehiclePrice3(
            vehicle,
            allVehicles,
            prices,
            startRentalTime,
            currentTime,
            vehicle.startDateTime,
            vehicle.endDateTime
          );
          return vehiclePrice;
        })
        .reduce((accumulator, currentValue) => +accumulator + +currentValue, 0);
      const sumOfPayments = payments.reduce((accumulator, currentValue) => {
        return +accumulator + +currentValue.amount;
      }, 0);
      if (price - sumOfPayments >= 0) {
        setAmountToPay(Math.ceil(price - sumOfPayments));
      } else {
        setAmountToPay(0);
      }
    }, 990);

    switch (rentalData.interval) {
      case "Hours":
        startTime && rentalData && setExpectedArrivalTime(addHours(startTime, parseInt(rentalData.hours)));
        break;
      case "30min":
        startTime && rentalData && setExpectedArrivalTime(addMinutes(startTime, 30));
        break;
      case "Today":
        startTime && rentalData && setExpectedArrivalTime(addHours(startTime, 10));
        break;
      case "Days":
        startTime && rentalData && setExpectedArrivalTime(addDays(startTime, parseInt(rentalData.days)));
        break;
      default:
        break;
    }

    return () => clearInterval(interval);
  }, [payments, allVehicles, prices, rentalData, targetKeys, props.rentalData.vehicles]);

  const prepaymentChangeHandler = (event) => {
    if (!isNaN(event.target.value)) {
      setFormData({
        ...formData,
        payments: [{ type: "Followup", amount: event.target.value, rentalpoint: props.rentalpoint }],
      });
    } else {
      message.info("Input is not a number");
      setFormData({
        ...formData,
        payments: [{ type: "Followup", amount: 0, rentalpoint: props.rentalpoint }],
      });
    }
  };

  const showModalConfirmRental = () => {
    isModalConfirmRentalVisible(true);
  };

  const handleOkConfirmRental = () => {
    let canBeCompleted = false;
    if (amountToPay - formData.payments[0].amount > 0) {
      message.info(`Rental can not be completed because there is still a liability of ${amountToPay - formData.payments[0].amount} PLN to be payed.`);
    }
    if (amountToPay - formData.payments[0].amount <= 0 && targetKeys.length < 1) {
      canBeCompleted = true;
    }
    props.changeVehicle(rentalData.rentalId, vehiclesToAdd, vehiclesToReturn, formData, canBeCompleted);
    isModalConfirmRentalVisible(false);
  };

  const handleCancelConfirmRental = () => {
    isModalConfirmRentalVisible(false);
  };

  const listData = [
    {
      id: "vehicles",
      label: <h3>Vehicles history</h3>,
      value: (
        <VehicleHistory vehicles={vehicles} allVehicles={allVehicles} prices={prices} startRentalTime={startRentalTime} currentTime={currentTime} />
      ),
    },
    {
      id: "payments",
      label: <h3>Payments history</h3>,
      value: <PaymentHistory payments={payments} />,
    },
    { id: "currentTime", label: "Current time:", value: currentTime && format(currentTime, "dd.MM.yyyy - HH:mm:ss") },
    { id: "startTime", label: "Start time:", value: startTime && format(startTime, "dd.MM.yyyy - HH:mm") },
    {
      id: "expectedArrival",
      label: "Expected arrival:",
      value: !!expectedArrivalTime && format(expectedArrivalTime, "dd.MM.yyyy - HH:mm"),
    },
    { id: "timeDifference", label: "Rental duration:", value: `${Math.ceil(timeDifference / 60)}`, unit: "Minutes" },
    { id: "toPay", style: "border: 3px solid red", label: "Amount to pay:", value: amountToPay, unit: "PLN" },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {console.log("vehiclesSource", vehiclesSource)}
      {console.log("targetKeys", targetKeys)}
      <Modal
        okButtonProps={{ disabled: false }}
        title="Confirm Rental"
        visible={modalConfirmRentalVisible}
        onOk={handleOkConfirmRental}
        onCancel={handleCancelConfirmRental}
      >
        <ConfirmRentalDialog amountToPay={amountToPay} formData={formData} targetKeys={targetKeys} />
      </Modal>
      <Transfer
        dataSource={vehiclesSource}
        titles={["Source", "Target"]}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onChange}
        onSelectChange={onSelectChange}
        showSearch
        render={(item) => item.vehicleid}
      />
      <List
        bordered
        dataSource={listData}
        renderItem={(item) => {
          return item.style ? (
            <List.Item style={{ border: "3px solid red" }}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row"> {item.label}</Col>
                <Col className="gutter-row">
                  {item.value} {item.unit}
                </Col>
              </Row>
            </List.Item>
          ) : (
            <List.Item>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row">{item.label}</Col>
                <Col className="gutter-row">
                  {item.value} {item.unit}
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
      <Card>
        <h3>Followup Payment</h3>
        <Input onChange={prepaymentChangeHandler} value={formData.payments[0].amount} type={"text"} id={"prepayment"} />
      </Card>
      <Button type="primary" onClick={showModalConfirmRental}>
        Change Rental
      </Button>
    </Space>
  );
};

export default ChangeVehicles;
