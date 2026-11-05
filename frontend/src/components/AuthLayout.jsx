
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Zap,
  CheckCircle2,
} from "lucide-react";

/**
 * Shared authentication page layout.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Login or registration form
 * @param {string} props.title - Page heading
 * @param {string} props.subtitle - Supporting description
 */
export default function AuthLayout({
  children,
  title,
  subtitle,
}) {
  return (
    <main className="auth-layout">
      {/* Left branding panel */}
      <aside className="auth-brand">
        <Link
          to="/login"
          className="brand-logo"
          aria-label="SecureAuth home"
        >
          <ShieldCheck size={32} strokeWidth={2.2} />
          <span>SecureAuth</span>
        </Link>

        <div className="brand-content">
          <div className="brand-badge">
            <CheckCircle2 size={16} />
            <span>Modern Authentication Platform</span>
          </div>

          <h1>
            Your digital world,
            <span> securely connected.</span>
          </h1>

          <p>
            Experience a modern and intuitive way to manage
            your account, with security and simplicity
            at its core.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <LockKeyhole size={20} />
              <span>Secure account management</span>
            </div>

            <div className="brand-feature">
              <Zap size={20} />
              <span>Fast and seamless experience</span>
            </div>
          </div>
        </div>

        <footer className="brand-footer">
          <p>
            © {new Date().getFullYear()} SecureAuth.
            All rights reserved.
          </p>
          <span>Prodigy InfoTech | Full Stack Development</span>
        </footer>
      </aside>

      {/* Right authentication panel */}
      <section className="auth-panel">
        <div className="auth-card">
          <Link to="/login" className="mobile-logo">
            <ShieldCheck size={28} />
            <span>SecureAuth</span>
          </Link>

          <header className="auth-heading">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </header>

          {children}
        </div>
      </section>
    </main>
  );
}
