import react, { Fragment, useState } from "react";
const ConfirmRentalDialog = (props) => {
  const payment = props.formData.payments[0].amount;
  const { amountToPay } = props;
  let infoText = "";

  if (props.targetKeys.length < 1) {
    if (amountToPay - payment > 0) {
      infoText = `Rental can not be finished because the client has still ${amountToPay - payment} PLN to pay.`;
    } else {
      infoText = "Rental will be completed. Make sure the client payed all his liabilities. Good Job :-)";
    }
  } else {
    infoText = `Rental is still running and will not be finished because there is at least one vehicle rented! So you can edit the rental and finish it later. Make sure you´ll collect the open amount of ${
      amountToPay - payment
    } PLN later. Good Job :-)`;
  }

  return (
    <Fragment>
      {console.log("props", props)}
      <p>The client payed {payment} PLN</p>
      <p>Open liability which has to be payed later amounts to {amountToPay - payment} PLN</p>
      <p>{infoText}</p>
    </Fragment>
  );
};

export default ConfirmRentalDialog;
