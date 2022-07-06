const roundToMoney = (val) => {
  // return (Math.floor(val * 100).toFixed(0) / 100).toFixed(2);
  return Math.round((Math.floor(val * 100).toFixed(0) / 100).toFixed(2));
};

export default roundToMoney;
