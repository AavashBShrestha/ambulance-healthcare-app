import { Link } from "react-router-dom";
import logo from "../assets/image/Logo.png";
import LoginFilter from "../auth-filter/LoginFilter";

const Header = () => {
  return (
    <div className="Header">
      <Link to="/home">
        <div className="Header__Logo">
          <img src={logo} alt="Logo" />
          <h4>Emergency Healthcare Assistance</h4>
        </div>
      </Link>
      <div className="Header__Menu">
        <Link to="/home">Home</Link>
        <Link to="/Hospital">Hospital</Link>
        <Link to="/BloodBank">Blood Bank</Link>
        <Link to="/Ambulance">Ambulance</Link>
        <Link to="/Map">Map</Link>
      </div>
      <div className="Header__ProfileMenu">
        <LoginFilter />
      </div>
    </div>
  );
};

export default Header;
