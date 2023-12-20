// import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
// import HotDeals from "./pages/Hotdeals";
import App from "./App";
import { Provider } from "react-redux";
import store from "./sevice/store";

import Account from "./pages/Account";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Setting from "./pages/Setting";
import ErrorPage from "./pages/ErrorPage";
import Help from "./pages/Help";

import AboutUs from "./pages/AboutUs";
import DetailSpace from "./pages/DetailSpace";
import DetailTask from "./pages/DetailTask";
import Spaces from "./pages/Spaces";
import AloneOwnerTasks from "./pages/AloneOwnerTasks";
import AloneSharedTasks from "./pages/AloneSharedTasks";
import FirstAccess from "./pages/FirstAccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Spaces />,
        errorElement: <ErrorPage />,
      },
      {
        path: "your-alone-tasks",
        element: <AloneOwnerTasks />,
        errorElement: <ErrorPage />,
      },
      {
        path: "alone-shared-tasks",
        element: <AloneSharedTasks />,
        errorElement: <ErrorPage />,
      },
      {
        path: "space/:spaceId",
        element: <DetailSpace />,
        errorElement: <ErrorPage />,
      },
      {
        path: "task/:taskId",
        element: <DetailTask />,
        errorElement: <ErrorPage />,
      },
      {
        path: "help",
        element: <Help />,
        errorElement: <ErrorPage />,
      },
      {
        path: "account",
        element: <Account />,
        errorElement: <ErrorPage />,
      },
      {
        path: "setting",
        element: <Setting />,
        errorElement: <ErrorPage />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
        errorElement: <ErrorPage />,
      },
      {
        path: "logout",
        element: <Logout />,
        errorElement: <ErrorPage />,
      },
      {
        path: "login",
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: "url-login/:accessString",
        element: <FirstAccess />,
        errorElement: <ErrorPage />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <RouterProvider router={router} />
    {/* </React.StrictMode> */}
    </Provider>
);