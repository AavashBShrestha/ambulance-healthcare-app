import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth-filter/useAuth";
import "../stylesheet/Style.scss";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="Profile">
      <h1>Profile</h1>
      {user && (
        <p>
          {user.name || user.username} ({user.role})
        </p>
      )}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Profile;
