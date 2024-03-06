import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "antd/dist/antd.min.css";

import HomePage from "./pages/Home";
import RentalPage from "./pages/Rentals";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import Authentication from "./pages/Authentication"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "auth", element: <Authentication /> },
      { path: "rentals", element: <RentalPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
