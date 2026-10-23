import { Link } from "react-router-dom";
import Profile from "../assets/image/Profile.png";
import { useAuth } from "./useAuth";

function LoginFilter() {
  const { user, loading } = useAuth();

  if (loading) return <div className="Header__ProfileMenu" />;

  if (user) {
    return (
      <div className="Header__ProfileMenu">
        <i className="far fa-bell fa-2x Notification" aria-label="Notifications"></i>
        <Link to="/profile" className="Header__ProfileMenu-Profile">
          <img src={Profile} alt="Profile" />
        </Link>
      </div>
    );
  }

  return (
    <div className="Header__ProfileMenu">
      <Link to="/login" className="Header__ProfileMenu-Login">
        Login
      </Link>
      <Link to="/signup" className="Header__ProfileMenu-Signup">
        Signup
      </Link>
    </div>
  );
}

export default LoginFilter;
