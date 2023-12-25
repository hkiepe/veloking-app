export async function fetchAvailableRentalpoints() {
  const response = await fetch("https://skywalker.inkontor.com/point/list", {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch rentalpoints");
  }
  return resData;
}
