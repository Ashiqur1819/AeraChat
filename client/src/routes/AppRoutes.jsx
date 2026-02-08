import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import { createContext } from "react";
import { AuthContext } from "../../context/authContext";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  const { authUser } = createContext(AuthContext);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}
        />
      </Routes>
    </div>
  );
}

export default AppRoutes;
