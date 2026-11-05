
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import { authService } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setServerMessage("");
    setLoginSuccess(false);

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setLoginSuccess(true);
      setServerMessage(response.message || "Login successful.");

      // Confirm the session before redirecting.
      await authService.getProfile();

      // Dashboard route will be created in the next step.
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setLoginSuccess(false);
      setServerMessage(
        error.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your SecureAuth account."
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>

          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              disabled={isLoading}
              required
            />
          </div>

          {errors.email && (
            <p className="field-error" role="alert">
              <AlertCircle size={14} />
              {errors.email}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <div className="input-wrapper">
            <LockKeyhole className="input-icon" size={18} />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              disabled={isLoading}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="field-error" role="alert">
              <AlertCircle size={14} />
              {errors.password}
            </p>
          )}
        </div>

        {serverMessage && (
          <div
            className="form-message"
            role={loginSuccess ? "status" : "alert"}
          >
            {loginSuccess ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}

            <span>{serverMessage}</span>
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          <span>
            {isLoading ? "Signing in..." : "Sign In"}
          </span>

          {!isLoading && <ArrowRight size={18} />}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
