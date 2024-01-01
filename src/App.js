import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RentalPage from "./pages/Rentals";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/rentals", element: <RentalPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
