import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextPage } from "./NextPage.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    // children: [
    //   {
    //     path: "/next-page/:id",
    //     element: <NextPage />,
    //   },
    // ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
