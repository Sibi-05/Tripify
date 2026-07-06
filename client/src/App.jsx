import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import MessagesList from "./components/MessagesList";
import Messages from "./pages/Messages";
import BookMarks from "./pages/BookMarks.jsx";
import Profile from "./pages/Profile";
import SingleTrip from "./pages/SingleTrip";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import {Provider} from "react-redux";
import store from "./store/store";
import CreateTrip from "./pages/CreateTrip.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import SearchPage from "./pages/SearchPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "messages",
        element: <MessagesList />,
      },
      {
        path: "messages/:receiverId",
        element: <Messages />,
      },
      {
        path: "newTrip",
        element: <CreateTrip />,
      },
      {
        path: "bookmarks",
        element: <BookMarks />,
      },
      {
        path: "users/:id",
        element: <Profile />,
      },
      {
        path: "trips/:id",
        element: <SingleTrip />,
      },
      {
        path: "explore",
        element: <SearchPage />,
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
      <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
  
);
};

export default App;