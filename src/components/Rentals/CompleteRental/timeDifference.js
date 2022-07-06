import moment from "moment";
import "moment-precise-range-plugin";

const timeDifference = (initialTime, finalTime) => {
  return moment.preciseDiff(initialTime, finalTime, true);
};

export default timeDifference;
