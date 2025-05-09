import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'

import DebugPage from "./DebugPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/wahasearch",
    element: <App />,
  },
  {
    path: "/wahasearch/:faction/:unit",
    element: <App />,
  },
  {
    path: "/wahasearch/debug",
    element: <DebugPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
