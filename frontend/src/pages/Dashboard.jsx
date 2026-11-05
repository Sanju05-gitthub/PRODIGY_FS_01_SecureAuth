
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  UserRound,
  Mail,
  CalendarDays,
  LockKeyhole,
  LogOut,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { authService } from "../services/authService";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await authService.getProfile();

        if (active) {
          setUser(response.user);
        }
      } catch {
        if (active) {
          navigate("/login", { replace: true });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError("");

    try {
      await authService.logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log out.");
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <LoaderCircle className="dashboard-spinner" size={34} />
        <p>Verifying your secure session...</p>
      </div>
    );
  }

  if (!user) return null;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <ShieldCheck size={30} />
          <span>SecureAuth</span>
        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={18} />
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <span className="dashboard-eyebrow">
            <CheckCircle2 size={16} />
            Authenticated session
          </span>

          <h1>Welcome back, {user.name}!</h1>

          <p>
            Your SecureAuth dashboard is ready. Your account
            information is retrieved securely from the backend.
          </p>
        </div>

        {error && (
          <div className="dashboard-error" role="alert">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="dashboard-grid">
          <section className="dashboard-card">
            <div className="dashboard-card-heading">
              <UserRound size={22} />
              <h2>Account Overview</h2>
            </div>

            <div className="dashboard-detail">
              <div className="dashboard-detail-icon">
                <UserRound size={19} />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{user.name}</strong>
              </div>
            </div>

            <div className="dashboard-detail">
              <div className="dashboard-detail-icon">
                <Mail size={19} />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="dashboard-detail">
              <div className="dashboard-detail-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <span>Member Since</span>
                <strong>{joinedDate}</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-card">
            <div className="dashboard-card-heading">
              <LockKeyhole size={22} />
              <h2>Security Overview</h2>
            </div>

            <div className="dashboard-security">
              <div className="dashboard-security-icon">
                <ShieldCheck size={42} />
              </div>

              <h3>Your session is verified</h3>

              <p>
                Your identity has been verified using a
                protected backend API.
              </p>

              <div className="dashboard-status">
                <CheckCircle2 size={18} />
                Authentication active
              </div>
            </div>
          </section>
        </div>

        <footer className="dashboard-footer">
          SecureAuth — Prodigy InfoTech Full Stack Development Project
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
