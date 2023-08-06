import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import AuthProvider from "./providers/AuthProvider.jsx";
import LogOffRoute from "./routes/LogOffRoute.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Root from "./Root.jsx";
import Error from "./pages/Error.jsx";
import Signin from "./pages/Signin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewNote from "./pages/NewNote.jsx";
import ViewNote from "./pages/ViewNote.jsx";
import EditNote from "./pages/EditNote.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: (
            <LogOffRoute>
              <Signin />
            </LogOffRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "new-note",
          element: (
            <PrivateRoute>
              <NewNote />
            </PrivateRoute>
          ),
        },
        {
          path: "view-note/:id",
          element: (
            <PrivateRoute>
              <ViewNote />
            </PrivateRoute>
          ),
        },
        {
          path: "edit-note/:id",
          element: (
            <PrivateRoute>
              <EditNote />
            </PrivateRoute>
          ),
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
