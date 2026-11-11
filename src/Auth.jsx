
import { useState } from "react";

export default function Auth({ onBack }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (isSignup && !username.trim()) {
      setMessage("Please choose a username.");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setMessage("Your passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setMessage("Your password must be at least 8 characters.");
      return;
    }

    setMessage(
      isSignup
        ? "Your form is ready! Account connection is coming next."
        : "Your form is ready! Login connection is coming next."
    );
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  return (
    <main className="auth-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <section className="auth-card">
        <div className="auth-logo">𖦹 blink</div>

        <h1>{isSignup ? "Create your account" : "Welcome to Blink"}</h1>

        <p>
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
              />
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          )}

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}

          <button className="auth-submit" type="submit">
            {isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        {!isSignup && (
          <button
            type="button"
            className="forgot-button"
            onClick={() =>
              setMessage("Password recovery will be connected next.")
            }
          >
            Forgot password?
          </button>
        )}
      </section>
    </main>
  );
                    }
