import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import Root from "./Root.jsx";
import Signin from "./pages/Signin.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Signin />,
        },
      ],
    },
  ]);

  return (
    // imagekit authentication provider
    <IKContext
      urlEndpoint={`https://ik.imagekit.io/${import.meta.env.VITE_IK_ID}`}
    >
      <RouterProvider router={router} />
    </IKContext>
  );
};

export default App;
