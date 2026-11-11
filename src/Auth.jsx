
import { useState } from "react";
import { supabase } from "./supabase";

export default function Auth({ onBack }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const isSignup = mode === "signup";

  function notify(text, type = "info") {
    setMessage(text);
    setMessageType(type);
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    if (isSignup) {
      if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
        notify(
          "Username must be 3–20 characters and contain only letters, numbers or underscores.",
          "error"
        );
        return;
      }

      if (password !== confirmPassword) {
        notify("Your passwords do not match.", "error");
        return;
      }
    }

    if (password.length < 8) {
      notify("Your password must be at least 8 characters.", "error");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              username: cleanUsername,
              display_name: cleanUsername,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          notify("Your account is ready. Welcome to Blink!", "success");
        } else {
          notify(
            "Account created! Please check your email to confirm your address.",
            "success"
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        notify("Welcome back!", "success");
      }
    } catch (error) {
      notify(error.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setMessage("");

    if (!email.trim()) {
      notify("Enter your email address first.", "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase()
      );

      if (error) throw error;

      notify(
        "If an account exists for this email, password reset instructions will be sent.",
        "success"
      );
    } catch (error) {
      notify(error.message || "Could not send the reset email.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <section className="auth-card">
        <div className="auth-logo">𖦹 blink</div>

        <h1>{isSignup ? "Create your account" : "Welcome to Blink"}</h1>

        <p className="auth-intro">
          {isSignup
            ? "Your own little corner of the internet starts here."
            : "Log in and pick up where you left off."}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isSignup ? "active-tab" : ""}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>

          <button
            type="button"
            className={isSignup ? "active-tab" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              Username
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                maxLength={20}
                required
              />
              <span className="field-hint">
                3–20 characters · letters, numbers and underscores
              </span>
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {isSignup && (
            <label>
              Confirm password
              <div className="password-field">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          )}

          {message && (
            <p className={`auth-message ${messageType}`} role="status">
              {message}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        {!isSignup && (
          <button
            type="button"
            className="forgot-button"
            onClick={handlePasswordReset}
            disabled={loading}
          >
            Forgot password?
          </button>
        )}
      </section>
    </main>
  );
        }
