import React, { Fragment } from "react";

import { Card, Space } from "antd";

import AddRental from "../Rentals/AddRentalForm/AddRental";
import RentalsList from "../Rentals/RentalsList";

const Home = (props) => {
  return (
    <Fragment>
      <AddRental
        prices={props.prices}
        vehicles={props.vehicles}
        rentalpoint={props.rentalpoint}
        getRentals={props.getRentals}
        onAddRental={props.onAddRental}
      />
      <RentalsList
        vehicles={props.vehicles}
        rentalpoint={props.rentalpoint}
        rentalsList={props.rentalsList}
        updateRental={props.updateRental}
        completeRental={props.completeRental}
        changeVehicles={props.changeVehicles}
        deleteRental={props.deleteRental}
      />
    </Fragment>
  );
};

export default Home;
