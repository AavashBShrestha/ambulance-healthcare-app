import "../stylesheet/Style.scss";
import "../stylesheet/Signup.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth-filter/useAuth";
import { getErrorMessage } from "../api/client";
import { HOME_BY_ROLE, PASSWORD_CHECKS, PASSWORD_RULE } from "../utils/password";

function SignUp() {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordValid = PASSWORD_RULE.test(registerData.password);
  const passwordMatch =
    !registerData.confirmPassword || registerData.confirmPassword === registerData.password;

  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");

    if (!passwordValid) return setError("Please choose a stronger password.");
    if (registerData.password !== registerData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setSubmitting(true);
    try {
      const payload = { ...registerData };
      delete payload.confirmPassword;
      const user = await signup(payload);
      navigate(user.role === "patient" ? "/PatientForm" : HOME_BY_ROLE[user.role], { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Signup failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="SignUp-Form">
      <form className="Signup" onSubmit={handleSignUp}>
        <h1>Create Your Account</h1>

        <div className="Signup__Field">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your full name" required onChange={handleChange} />
        </div>

        <div className="Signup__Field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
        </div>

        <div className="Signup__Field">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" placeholder="Enter Username" required onChange={handleChange} />
        </div>

        <div className="Signup__Field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Create a password" required onChange={handleChange} />

          {registerData.password && !passwordValid && (
            <ul className="password-requirements">
              {PASSWORD_CHECKS.map((check) => (
                <li key={check.label} style={{ color: check.test(registerData.password) ? "green" : "red" }}>
                  {check.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="Signup__Field">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            onChange={handleChange}
          />
          {!passwordMatch && <p className="password-warning">Passwords do not match!</p>}
        </div>

        <div className="Signup__Field">
          <label htmlFor="role">Sign up as:</label>
          <select id="role" name="role" value={registerData.role} onChange={handleChange}>
            <option value="patient">🧑‍⚕️ Patient</option>
            <option value="ambulance">🚑 Ambulance</option>
            <option value="hospital">🏥 Hospital</option>
            <option value="bloodbank">🩸 Blood Bank</option>
          </select>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="Signup__Button">
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </div>

        <p className="small-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
