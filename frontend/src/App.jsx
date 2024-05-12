import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootPage from "./pages/RootPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import Squad from "./components/Squad";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import RegistMember from "./components/RegistMember";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <ProtectedRoute redirectPath="/login" />,
          children: [
            { index: true, element: <Squad /> },
            { path: "registMember", element: <RegistMember /> },
          ],
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
  ]);
  return (
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;