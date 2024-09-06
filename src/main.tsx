import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { NextPage } from "./NextPage.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

if (import.meta.env.VITE_REACT_APP_X_STATE_INSPECTOR === "true") {
  import("@xstate/inspect").then(({ inspect }) => {
    inspect({
      // options
      // url: 'https://stately.ai/viz?inspect', // (default)
      iframe: false, // open in new window
    });
  });
}

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
