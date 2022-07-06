import { Table } from "antd";
import { format } from "date-fns";

const PaymentHistory = (props) => {
  const paymentColumns = [
    {
      title: "Payment type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Data & Time",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const paymentsSource = props.payments.map((payment, index) => {
    const paymentTime = format(new Date(payment.paymentTimestamp), "dd.MM.yyyy - HH:mm:ss");
    return {
      key: index,
      type: payment.type.charAt(0).toUpperCase() + payment.type.slice(1),
      amount: payment.amount + " PLN",
      timestamp: paymentTime,
    };
  });

  return <Table pagination={false} size="small" dataSource={paymentsSource} columns={paymentColumns} />;
};

export default PaymentHistory;
