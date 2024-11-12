import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

export function Account() {
  const location = useLocation();
  const { username } = useParams<{
    username: string;
  }>();

  if (location.pathname === `/account/${username}`) {
    return <Navigate to="inventory" replace />;
  }

  return <Outlet />;
}
