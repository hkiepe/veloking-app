import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "antd/dist/antd.min.css";

import HomePage from "./pages/Home";
import RentalPage from "./pages/Rentals";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import AuthenticationPage, {
  action as authAction,
} from "./pages/Authentication";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "auth", element: <AuthenticationPage />, action: authAction },
      { path: "rentals", element: <RentalPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
