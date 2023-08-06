import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import AuthProvider from "./providers/AuthProvider.jsx";
import Root from "./Root.jsx";
import Error from "./pages/Error.jsx";
import Signin from "./pages/Signin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewNote from "./pages/NewNote.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Signin />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "new-note",
          element: <NewNote />,
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
