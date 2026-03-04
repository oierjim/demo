import { Navigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';




interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleProtectedRoute({ children, allowedRoles }: Props) {

  const { user } = useAuth();

  const hasAnyRole = user?.roles?.some(role =>
    allowedRoles.includes(role)
  );

  if (!hasAnyRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}