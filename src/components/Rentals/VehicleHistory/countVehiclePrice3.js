import { differenceInSeconds } from "date-fns";

const countVehiclePrice3 = (vehicle, vehicles, prices, startRentalTime, currentTime, startTime, endTime) => {
  const category = vehicles.filter((item) => item.vehicleid === vehicle.vehicleid)[0].superiorCategory;
  const priceItem = prices.filter((item) => item.category === category)[0];
  const minuteInSeconds = 60;
  const halfHourInSeconds = minuteInSeconds * 30;
  const hourInSeconds = halfHourInSeconds * 2;
  const tenHoursInSeconds = hourInSeconds * 10;
  const dayInSeconds = hourInSeconds * 24;

  const overallTimeDifference = differenceInSeconds(new Date(currentTime), new Date(startRentalTime));

  let basePriceInterval = "";
  if (overallTimeDifference <= halfHourInSeconds) {
    basePriceInterval = "baseHalfHour";
  }
  if (halfHourInSeconds < overallTimeDifference && overallTimeDifference <= hourInSeconds) {
    basePriceInterval = "baseFirstHour";
  }
  if (hourInSeconds < overallTimeDifference && overallTimeDifference <= tenHoursInSeconds) {
    basePriceInterval = "baseDay";
  }
  if (tenHoursInSeconds < overallTimeDifference) {
    basePriceInterval = "base24Hours";
  }

  let timeDifference = 0;
  if (!!endTime) {
    timeDifference = differenceInSeconds(new Date(endTime), new Date(startTime));
  } else {
    timeDifference = differenceInSeconds(new Date(currentTime), new Date(startTime));
  }

  const hours = Math.trunc(timeDifference / hourInSeconds);
  const remainingSeconds = timeDifference % hourInSeconds;

  switch (basePriceInterval) {
    case "baseHalfHour":
      if (!!priceItem.halfHour) {
        return priceItem.halfHour;
      } else if (!!priceItem.firstHour) {
        return priceItem.firstHour / 2;
      } else {
        return priceItem.hour / 2;
      }

    case "baseFirstHour":
      if (!!priceItem.firstHour) {
        return priceItem.firstHour;
      } else {
        return priceItem.hour;
      }

    case "baseDay":
      let hoursPrice = 0;
      if (hours > 0) {
        if (!!priceItem.firstHour) {
          hoursPrice = priceItem.firstHour + priceItem.hour * (hours - 1) + (remainingSeconds * priceItem.hour) / hourInSeconds;
        } else {
          hoursPrice = priceItem.hour * hours + (remainingSeconds * priceItem.hour) / hourInSeconds;
        }
      } else {
        if (!!priceItem.firstHour) {
          hoursPrice = (remainingSeconds * priceItem.firstHour) / hourInSeconds;
        }
        hoursPrice = (remainingSeconds * priceItem.hour) / hourInSeconds;
      }

      if (hoursPrice >= priceItem.day) {
        return priceItem.day;
      } else {
        return hoursPrice;
      }

    case "base24Hours":
      const payment24hours = (timeDifference * priceItem.p24hours) / dayInSeconds;

      if (payment24hours <= priceItem.p24hours) {
        return priceItem.p24hours;
      } else {
        return payment24hours;
      }

    default:
      return "no price selected";
  }
};

export default countVehiclePrice3;
