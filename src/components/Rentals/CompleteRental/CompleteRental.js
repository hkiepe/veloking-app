import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Button, List} from "antd";
import countVehiclePrice2 from "./countVehiclePrice2";
import { format, differenceInSeconds, addHours, addMinutes, addDays } from "date-fns";
import VehicleHistory from "../VehicleHistory/VehicleHistory";
import PaymentHistory from "../PaymentHistory/PaymentHistory";

const CompleteRental = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeDifference, setTimeDifference] = useState();
  const [finalAmount, setFinalAmount] = useState();
  const [startTime, setStartTime] = useState();
  const [expectedArrivalTime, setExpectedArrivalTime] = useState();

  const { vehicles, payments, startRentalTime } = props.rentalData;
  const { rentalData, prices } = props;
  const allVehicles = props.vehicles;

  const getTimeDifference = useCallback(() => {
    const currentTime = new Date();
    setCurrentTime(currentTime);
    const startTimeFromTimestamp = new Date(startRentalTime);
    setStartTime(startTimeFromTimestamp);
    return differenceInSeconds(currentTime, startTimeFromTimestamp);
  }, [startRentalTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeDifferenceInSeconds = getTimeDifference();
      setTimeDifference(timeDifferenceInSeconds);
      let price = rentalData.vehicles
        .map((vehicle) => {
          const vehiclePrice = countVehiclePrice2(vehicle, allVehicles, prices, timeDifferenceInSeconds);
          return vehiclePrice;
        })
        .reduce((partialSum, a) => partialSum + a, 0);
      const sumOfPayments = payments.reduce((accumulator, currentValue, currentIndex) => {
        return accumulator + currentValue.amount;
      }, 0);
      if (price - sumOfPayments >= 0) {
        setFinalAmount(Math.ceil(price - sumOfPayments));
      } else {
        setFinalAmount(0);
      }
    }, 999);

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
  }, [startTime, payments, allVehicles, prices, rentalData, getTimeDifference]);

  const completeRentalhandler = () => {
    const paymentTimestamp = new Date();
    payments.push({
      type: "final payment",
      amount: finalAmount,
      paymentTimestamp: paymentTimestamp.toISOString(),
    });
    props.completeRental(rentalData.rentalId, vehicles, payments);
    props.handleOk("test");
  };

  const listData = [
    {
      id: "vehicles",
      label: <h3>Vehicles history</h3>,
      value: <VehicleHistory vehicles={vehicles} />,
    },
    { id: "startTime", label: "Start time:", value: startTime && format(startTime, "dd.MM.yyyy - HH:mm:ss") },
    { id: "endTime", label: "End time:", value: currentTime && format(currentTime, "dd.MM.yyyy - HH:mm:ss") },
    {
      id: "expectedArrival",
      label: "Expected arrival:",
      value: !!expectedArrivalTime && format(expectedArrivalTime, "dd.MM.yyyy - HH:mm:ss"),
    },
    { id: "timeDifference", label: "Rental duration:", value: `${Math.ceil(timeDifference / 60)}`, unit: "Minutes" },
    {
      id: "payments",
      label: <h3>Payments history</h3>,
      value: <PaymentHistory payments={payments} />,
    },
    { id: "toPay", style: "border: 3px solid red", label: "Amount to pay:", value: finalAmount, unit: "PLN" },
  ];

  return (
    <Fragment>
      <List
        bordered
        dataSource={listData}
        renderItem={(item) =>
          item.style ? (
            <List.Item style={{ border: "3px solid red" }}>
              {item.label} {item.value} {item.unit}
            </List.Item>
          ) : (
            <List.Item>
              {item.label} {item.value} {item.unit}
            </List.Item>
          )
        }
      />
      <Button type="primary" onClick={completeRentalhandler}>
        Complete Rental
      </Button>
    </Fragment>
  );
};

export default CompleteRental;
