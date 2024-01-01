import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader/MainHeader";
import MainFooter from "../components/MainFooter/MainFooter";

function RootLayout() {
  return (
    <>
      <MainHeader
      // rentalpoint={rentalpoint}
      // isAuthenticated={loggedInUser}
      // onLogout={logoutHandler}
      />
      <Outlet />
      <MainFooter />
    </>
  );
}

export default RootLayout;
