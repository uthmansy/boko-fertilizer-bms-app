import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

function PrivateRoute({ element }) {
	const { user } = useAuth();

	return user ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
