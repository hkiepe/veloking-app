const countVehiclePrice = (vehicle, vehicles, prices, formData) => {
  const category = vehicles.filter((item) => item.vehicleid === vehicle)[0].superiorCategory;
  const priceItem = prices.filter((item) => item.category === category)[0];

  switch (formData.interval) {
    case "Hours":
      return priceItem.hour * formData.hours >= priceItem.day ? priceItem.day : priceItem.hour * formData.hours;
    case "Days":
      return priceItem.p24hours * formData.days;
    case "Today":
      return priceItem.day;
    case "30min":
      return priceItem.halfHour;
    default:
      return "no price selected";
  }
};

export default countVehiclePrice;
