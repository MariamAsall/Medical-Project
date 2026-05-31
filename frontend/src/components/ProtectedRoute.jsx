import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

const ProtectedRoute = ({
  allowedRoles,
  children,
}) => {

  const {
    isAuthenticated,
    role,
  } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(role)
  ) {

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;