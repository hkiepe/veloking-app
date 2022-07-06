const countVehiclePrice2 = (vehicle, vehicles, prices, timeDifference) => {
  const category = vehicles.filter((item) => item.vehicleid === vehicle.vehicleid)[0].superiorCategory;
  const priceItem = prices.filter((item) => item.category === category)[0];

  const minuteInSeconds = 60;
  const halfHourInSeconds = minuteInSeconds * 30;
  const hourInSeconds = halfHourInSeconds * 2;
  const tenHoursInSeconds = hourInSeconds * 10;
  const dayInSeconds = hourInSeconds * 24;

  if (timeDifference <= halfHourInSeconds) {
    return priceItem.halfHour;
  } else if (halfHourInSeconds < timeDifference && timeDifference <= tenHoursInSeconds) {
    var hours = Math.trunc(timeDifference / hourInSeconds);
    const remainingSeconds = timeDifference % hourInSeconds;
    if (hours * priceItem.hour + (remainingSeconds * priceItem.hour) / hourInSeconds >= priceItem.day) {
      return priceItem.day;
    } else {
      return hours * priceItem.hour + (remainingSeconds * priceItem.hour) / hourInSeconds;
    }
  } else if (tenHoursInSeconds < timeDifference) {
    const payment = (timeDifference * priceItem.p24hours) / dayInSeconds;
    if (payment <= priceItem.p24hours) {
      return priceItem.p24hours;
    } else {
      return payment;
    }
  }
};

export default countVehiclePrice2;
