import { useState } from "react";
import Auth from "./Auth";

export default function App() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <Auth onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="app">
      <header className="landing-header">
        <div className="logo">𖦹 blink</div>

        <div className="header-actions">
          <button
            className="login-button"
            onClick={() => setShowAuth(true)}
          >
            Log in
          </button>

          <button
            className="signup-button"
            onClick={() => setShowAuth(true)}
          >
            Sign up
          </button>
        </div>
      </header>

      <main className="hero">
        <div className="hero-text">
          <p className="eyebrow">a little corner of the internet</p>

          <h1>
            Be seen.
            <br />
            Be <span>you.</span>
          </h1>

          <p className="description">
            Share little moments, discover new people, and make your own
            corner of Blink.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => setShowAuth(true)}
            >
              Create an account
            </button>

            <button className="guest-button">
              Continue as guest
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="mini-logo">𖦹</div>
          <p>your profile</p>
          <div className="fake-avatar"></div>
          <strong>@yourusername</strong>
          <span>little moments & things i love ♡</span>
        </div>
      </main>
    </div>
  );
}
