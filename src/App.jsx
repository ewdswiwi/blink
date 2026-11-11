
import { useEffect, useState } from "react";
import Auth from "./Auth";
import { supabase } from "./supabase";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Session error:", error.message);
      }

      setSession(data?.session ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsGuest(false);
      setShowAuth(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!session?.user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username, display_name, bio, avatar_url, theme, accent_color")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Profile error:", error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [session]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);
      return;
    }

    setProfile(null);
    setIsGuest(false);
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <span className="loading-logo">𖦹 blink</span>
        <p>Getting things ready...</p>
      </main>
    );
  }

  if (showAuth && !session) {
    return <Auth onBack={() => setShowAuth(false)} />;
  }

  if (session || isGuest) {
    const username =
      profile?.display_name ||
      profile?.username ||
      session?.user?.email?.split("@")[0] ||
      "there";

    return (
      <main className="home-page">
        <header className="home-header">
          <div className="logo">𖦹 blink</div>

          <div className="home-account">
            {isGuest ? (
              <button
                className="signup-button"
                onClick={() => {
                  setIsGuest(false);
                  setShowAuth(true);
                }}
              >
                Join Blink
              </button>
            ) : (
              <button className="login-button" onClick={handleSignOut}>
                Log out
              </button>
            )}
          </div>
        </header>

        <section className="welcome-panel">
          <span className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</span>

          <h1>
            {isGuest ? "Welcome to Blink." : `Hello, ${username}.`}
          </h1>

          <p>
            {isGuest
              ? "You're exploring Blink as a guest. Create an account to join in."
              : "Your Blink account is connected. Your next chapter starts here."}
          </p>

          <div className="home-placeholder">
            <span className="placeholder-symbol">𖦹</span>
            <h2>Your feed is on its way.</h2>
            <p>
              Posts, discoveries and little moments will live here.
            </p>
          </div>
        </section>
      </main>
    );
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

            <button
              className="guest-button"
              onClick={() => setIsGuest(true)}
            >
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
