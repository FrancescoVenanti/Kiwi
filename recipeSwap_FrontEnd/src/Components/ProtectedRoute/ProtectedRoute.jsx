import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
	const token = useSelector((state) => state.auth.token);
	const location = useLocation();

	if (!token) {
		return <Navigate to="/Authentication" state={{ from: location }} replace />;
	}

	return children;
};

export default ProtectedRoute;
