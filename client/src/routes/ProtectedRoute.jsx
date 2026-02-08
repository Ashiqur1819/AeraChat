import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const{authUser, loading} = useContext(AuthContext)
  if (loading) return <div>Loading...</div>;
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute

