import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./login/login";
import Register from "./login/register";
import BookPage from "./book-page/book-page";
import Admin from "./admin/admin";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./profile/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    path: "/book/:id",
    element: <BookPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
