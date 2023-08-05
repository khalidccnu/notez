import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import AuthProvider from "./providers/AuthProvider.jsx";
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
    // user authentication provider
    <AuthProvider>
      {/* imagekit authentication provider */}
      <IKContext
        urlEndpoint={`https://ik.imagekit.io/${import.meta.env.VITE_IK_ID}`}
      >
        <RouterProvider router={router} />
      </IKContext>
    </AuthProvider>
  );
};

export default App;
