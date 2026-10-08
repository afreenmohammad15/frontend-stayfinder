import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(getFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(getFirebaseError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  function getFirebaseError(err) {
    const code = err?.code || "";
    switch (code) {
      case "auth/invalid-credential":
        return "Invalid email or password. If you haven't registered yet, please create an account first.";
      case "auth/user-not-found":
        return "No account found with this email. Please click 'Create an account' below.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please wait a moment and try again.";
      case "auth/operation-not-allowed":
        return "Sign-in method not enabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable it.";
      case "auth/unauthorized-domain":
        return "Domain not authorized. Please add 'localhost' in Firebase Console > Authentication > Settings > Authorized domains.";
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed before completing.";
      case "auth/popup-blocked":
        return "Popup was blocked by your browser. Please allow popups for localhost.";
      case "auth/network-request-failed":
        return "Network connection failed. Please check your internet connection.";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with the same email using a different sign-in method.";
      default:
        return err?.message || "Login failed. Please check your credentials and try again.";
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Brand */}
        <Link to="/" className="login-logo">🏠 StayFinder</Link>
        <h1>Welcome back</h1>
        <p className="login-subtitle">Sign in to continue finding your perfect stay.</p>

        {/* Error Message */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* ── GOOGLE BUTTON (PRIMARY) ── */}
        <button
          id="btn-google-login"
          type="button"
          className="google-btn google-btn-primary"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <span className="google-spinner" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        {/* ── DIVIDER ── */}
        <div className="auth-divider"><span>or sign in with email</span></div>

        {/* ── EMAIL / PASSWORD FORM ── */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="btn-email-login"
            type="submit"
            className="login-button"
            disabled={loading || googleLoading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>

        <Link to="/" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
}

export default Login;