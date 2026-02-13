import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
  const { authUser, loading } = useContext(AuthContext);
  if (loading) return <Loading />;
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
