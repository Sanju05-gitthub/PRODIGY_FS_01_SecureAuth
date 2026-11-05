
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import { authService } from "../services/authService";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      valid: formData.password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(formData.password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(formData.password),
    },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

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
    setRegistrationSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (name.length < 2 || name.length > 80) {
      newErrors.name = "Name must contain 2 to 80 characters.";
    }

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      newErrors.email = "Enter a valid email address.";
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 72
    ) {
      newErrors.password = "Password must contain 8 to 72 characters.";
    } else if (!passwordRequirements.every((item) => item.valid)) {
      newErrors.password =
        "Password must meet all the security requirements.";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setServerMessage("");
    setRegistrationSuccess(false);

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setRegistrationSuccess(true);
      setServerMessage(
        response.message || "Account created successfully."
      );

      setFormData(INITIAL_FORM);
    } catch (error) {
      setRegistrationSuccess(false);
      setServerMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      icon: UserRound,
      type: "text",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      icon: Mail,
      type: "email",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Create a secure password",
      icon: LockKeyhole,
      type: showPassword ? "text" : "password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      icon: LockKeyhole,
      type: showConfirmPassword ? "text" : "password",
      autoComplete: "new-password",
    },
  ];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join SecureAuth and experience secure account management."
    >
      <form onSubmit={handleSubmit} noValidate>
        {fields.map((field) => {
          const FieldIcon = field.icon;
          const isPasswordField =
            field.name === "password" ||
            field.name === "confirmPassword";

          const isVisible =
            field.name === "password"
              ? showPassword
              : showConfirmPassword;

          const toggleVisibility = () => {
            if (field.name === "password") {
              setShowPassword((previous) => !previous);
            } else {
              setShowConfirmPassword((previous) => !previous);
            }
          };

          return (
            <div className="form-group" key={field.name}>
              <label htmlFor={field.name}>
                {field.label}
              </label>

              <div className="input-wrapper">
                <FieldIcon
                  className="input-icon"
                  size={18}
                  aria-hidden="true"
                />

                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={
                    errors[field.name]
                      ? `${field.name}-error`
                      : undefined
                  }
                  disabled={isLoading}
                  required
                />

                {isPasswordField && (
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleVisibility}
                    aria-label={
                      isVisible ? "Hide password" : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {isVisible ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                )}
              </div>

              {errors[field.name] && (
                <p
                  className="field-error"
                  id={`${field.name}-error`}
                  role="alert"
                >
                  <AlertCircle size={14} />
                  {errors[field.name]}
                </p>
              )}

              {field.name === "password" && formData.password && (
                <div className="password-requirements">
                  {passwordRequirements.map((requirement) => (
                    <div
                      key={requirement.label}
                      className={`requirement ${
                        requirement.valid ? "valid" : ""
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>{requirement.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {serverMessage && (
          <div
            className="form-message"
            role={registrationSuccess ? "status" : "alert"}
          >
            {registrationSuccess ? (
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
            {isLoading ? "Creating account..." : "Create Account"}
          </span>
          {!isLoading && <ArrowRight size={18} />}
        </button>

        {registrationSuccess && (
          <p className="auth-switch">
            Account created!{" "}
            <Link to="/login">Sign in now</Link>
          </p>
        )}

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
