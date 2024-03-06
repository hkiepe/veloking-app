export function getAuthToken() {
  const token = localStorage.getItem("token");

  console.log("Token aus Storage :>> ", token);

  return token;
}
