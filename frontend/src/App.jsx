import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Partnerships from "./pages/Partnerships";
import Users from "./pages/Users";
import Requests from "./pages/Requests";
import Notifications from "./pages/Notifications";

function App() {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/dashboard" : "/partnerships"} />
          ) : (
            <Login />
          )
        }
      /> */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Navigate to={isAdmin ? "/dashboard" : "/partnerships"} />}
        />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route path="departments" element={<Departments />} />
        <Route path="partnerships" element={<Partnerships />} />

        <Route
          path="requests"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/partnerships" />} />
    </Routes>
  );
}

export default App;
