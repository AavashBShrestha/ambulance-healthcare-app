import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth-filter/useAuth";
import { getErrorMessage } from "../api/client";
import { HOME_BY_ROLE } from "../utils/password";

function Login() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(loginData.username, loginData.password);
      navigate(location.state?.from?.pathname || HOME_BY_ROLE[user.role] || "/home", {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid username or password"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="Login-Form">
      <form className="Login" onSubmit={handleSubmit}>
        <h1>Log In</h1>

        <div className="Login__Field">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your Username" required onChange={handleChange} />
        </div>

        <div className="Login__Field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="Login__Button">
          <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </div>

        <div className="Login__Footer">
          <p>
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
