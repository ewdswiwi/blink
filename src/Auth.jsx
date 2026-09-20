export default function Auth({ onBack }) {
  return (
    <main className="auth-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <section className="auth-card">
        <div className="auth-logo">𖦹 blink</div>

        <h1>Welcome to Blink</h1>
        <p>Log in or create your account.</p>

        <div className="auth-tabs">
          <button className="active-tab">Log in</button>
          <button>Sign up</button>
        </div>

        <form>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Your password" />
          </label>

          <button className="auth-submit" type="button">
            Log in
          </button>
        </form>

        <button className="forgot-button">Forgot password?</button>
      </section>
    </main>
  );
}
