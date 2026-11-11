import { useEffect, useState } from "react";
import Auth from "./Auth";
import { supabase } from "./supabase";

const navigation = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "explore", icon: "⌕", label: "Explore" },
  { id: "messages", icon: "✉", label: "Messages" },
  { id: "notifications", icon: "♡", label: "Notifications" },
  { id: "saved", icon: "▤", label: "Saved" },
  { id: "profile", icon: "◎", label: "Profile" },
];

function getPostText(post) {
  return post.content || post.caption || post.body || post.text || "";
}

function getPostImage(post) {
  return post.image_url || post.media_url || post.image || "";
}

function formatDate(date) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) console.error(error.message);

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
        .select("*")
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

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      setPostsLoading(true);
      setFeedError("");

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!active) return;

      if (error) {
        console.error("Feed error:", error.message);
        setFeedError("We couldn't load the feed just yet.");
        setPosts([]);
      } else {
        setPosts(data || []);
      }

      setPostsLoading(false);
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, [session]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    setProfile(null);
    setIsGuest(false);
    setActivePage("home");
  }

  function openAuth() {
    setIsGuest(false);
    setShowAuth(true);
  }

  const displayName =
    profile?.display_name ||
    profile?.username ||
    session?.user?.email?.split("@")[0] ||
    "there";

  const username = profile?.username || "yourusername";

  const filteredPosts = posts.filter((post) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      getPostText(post).toLowerCase().includes(query) ||
      (post.username || "").toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <main className="loading-screen">
        <span className="loading-logo">𖦹 blink</span>
        <span className="loading-dot" />
      </main>
    );
  }

  if (showAuth && !session) {
    return <Auth onBack={() => setShowAuth(false)} />;
  }

  if (!session && !isGuest) {
    return (
      <div className="landing">
        <header className="landing-header">
          <a className="brand" href="#top">𖦹 blink</a>
          <div className="landing-actions">
            <button className="button-quiet" onClick={openAuth}>
              Log in
            </button>
            <button className="button-primary" onClick={openAuth}>
              Sign up
            </button>
          </div>
        </header>

        <main className="landing-hero" id="top">
          <div className="landing-copy">
            <span className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</span>
            <h1>
              Be seen.
              <br />
              Be <span>you.</span>
            </h1>
            <p>
              A place for little moments, new discoveries and everything
              that makes you, you.
            </p>
            <div className="landing-buttons">
              <button className="button-primary large" onClick={openAuth}>
                Create an account <span>↗</span>
              </button>
              <button
                className="button-quiet large"
                onClick={() => setIsGuest(true)}
              >
                Explore as guest
              </button>
            </div>
            <span className="landing-note">A little space to be yourself ♡</span>
          </div>

          <div className="landing-art">
            <div className="art-glow" />
            <div className="art-card art-card-back">
              <span>little moments</span>
              <div className="art-shapes">✳</div>
            </div>
            <div className="art-card art-card-front">
              <div className="art-top">
                <span>𖦹 blink</span>
                <span>•••</span>
              </div>
              <div className="art-photo">
                <span>your world,</span>
                <strong>your way.</strong>
                <span className="art-sparkle">✳</span>
              </div>
              <div className="art-bottom">
                <span>♡　⌕　✉</span>
                <span>✧</span>
              </div>
            </div>
            <span className="floating-star star-one">✳</span>
            <span className="floating-star star-two">✧</span>
          </div>
        </main>
      </div>
    );
  }

  if (activePage !== "home") {
    const current = navigation.find((item) => item.id === activePage);

    return (
      <div className="app-shell">
        <aside className="sidebar">
          <a className="brand sidebar-brand" href="#" onClick={() => setActivePage("home")}>
            𖦹 blink
          </a>
          <nav className="nav-list">
            {navigation.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? "selected" : ""}`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <button className="sidebar-compose" onClick={openAuth}>
            Join the conversation <span>↗</span>
          </button>
          <div className="sidebar-user">
            <div className="avatar">{displayName[0]?.toUpperCase()}</div>
            <div className="sidebar-user-info">
              <strong>{displayName}</strong>
              <span>@{username}</span>
            </div>
            {session && (
              <button className="more-button" onClick={handleSignOut}>···</button>
            )}
          </div>
        </aside>

        <main className="main-column empty-page">
          <div className="mobile-topbar">
            <span className="brand">𖦹 blink</span>
            <button onClick={handleSignOut}>Log out</button>
          </div>
          <span className="eyebrow">YOUR BLINK SPACE</span>
          <h1>{current?.label || "Blink"}</h1>
          <div className="empty-card">
            <span className="empty-symbol">{current?.icon || "✧"}</span>
            <h2>This space is getting ready.</h2>
            <p>
              We're building this part of Blink carefully. Your feed is
              available from the Home tab.
            </p>
            <button className="button-primary" onClick={() => setActivePage("home")}>
              Back to home
            </button>
          </div>
        </main>

        <aside className="right-column">
          <div className="side-note">
            <span className="eyebrow">A LITTLE REMINDER</span>
            <p>Your corner of the internet can be whatever you make it.</p>
            <span>♡</span>
          </div>
        </aside>

        <MobileNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand sidebar-brand" href="#" onClick={() => setActivePage("home")}>
          𖦹 blink
        </a>

        <nav className="nav-list">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "selected" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="sidebar-compose" onClick={openAuth}>
          Create a post <span>＋</span>
        </button>

        <div className="sidebar-user">
          <div className="avatar">
            {displayName[0]?.toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <strong>{displayName}</strong>
            <span>@{username}</span>
          </div>
          {session && (
            <button className="more-button" onClick={handleSignOut}>···</button>
          )}
        </div>
      </aside>

      <main className="main-column">
        <header className="mobile-topbar">
          <span className="brand">𖦹 blink</span>
          <button onClick={session ? handleSignOut : openAuth}>
            {session ? "Log out" : "Join"}
          </button>
        </header>

        <div className="feed-heading">
          <div>
            <span className="eyebrow">YOUR LITTLE CORNER</span>
            <h1>Home</h1>
          </div>
          <button className="icon-button" aria-label="Refresh feed" onClick={() => window.location.reload()}>
            ↻
          </button>
        </div>

        <div className="stories-section">
          <div className="section-heading">
            <h2>Little moments</h2>
            <span>Stories</span>
          </div>
          <div className="stories-row">
            <button className="story-item add-story" onClick={openAuth}>
              <span className="story-ring"><span>＋</span></span>
              <span>Your story</span>
            </button>
            <div className="story-item">
              <span className="story-ring story-blue"><span>✧</span></span>
              <span>Discover</span>
            </div>
            <div className="story-item">
              <span className="story-ring story-lilac"><span>♡</span></span>
              <span>Moments</span>
            </div>
            <div className="story-item">
              <span className="story-ring story-peach"><span>✳</span></span>
              <span>Inspire</span>
            </div>
          </div>
          <p className="stories-caption">Story publishing is coming after privacy settings are ready.</p>
        </div>

        <div className="feed-tools">
          <div>
            <h2>For you</h2>
            <span>Little things from the Blink community.</span>
          </div>
          <input
            className="feed-search"
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {postsLoading ? (
          <div className="feed-state">Finding little moments...</div>
        ) : feedError ? (
          <div className="feed-state">
            <span>♡</span>
            <p>{feedError}</p>
            <small>Check your posts table and its read policies in Supabase.</small>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="feed-state">
            <span>✧</span>
            <h3>{search ? "No matching posts" : "A fresh beginning."}</h3>
            <p>
              {search
                ? "Try another search."
                : "There aren't any visible posts here yet. Your community's moments will appear here."}
            </p>
          </div>
        ) : (
          <div className="post-list">
            {filteredPosts.map((post) => {
              const image = getPostImage(post);
              const text = getPostText(post);
              const author = post.display_name || post.username || "Blink member";

              return (
                <article className="post-card" key={post.id}>
                  <div className="post-header">
                    <div className="avatar post-avatar">
                      {(author[0] || "B").toUpperCase()}
                    </div>
                    <div className="post-author">
                      <strong>{author}</strong>
                      <span>
                        {post.username ? `@${post.username}` : "A Blink member"}
                        {post.created_at ? ` · ${formatDate(post.created_at)}` : ""}
                      </span>
                    </div>
                    <button className="more-button" aria-label="More post options">···</button>
                  </div>
                  {text && <p className="post-text">{text}</p>}
                  {image && (
                    <img className="post-image" src={image} alt="Post attachment" />
                  )}
                  <div className="post-footer">
                    <span>♡</span>
                    <span>Comment</span>
                    <span className="post-share">↗</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="feed-footer">𖦹 blink · a little space to be yourself</footer>
      </main>

      <aside className="right-column">
        <div className="search-card">
          <span className="search-symbol">⌕</span>
          <input
            type="search"
            placeholder="Search Blink"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <section className="side-card">
          <span className="eyebrow">A LITTLE NOTE</span>
          <h2>Make yourself at home.</h2>
          <p>
            Find your people, share what you love and make this space your own.
          </p>
          <span className="side-heart">♡</span>
        </section>

        <section className="side-card side-profile">
          <span className="eyebrow">YOUR SPACE</span>
          <div className="side-profile-row">
            <div className="avatar">{displayName[0]?.toUpperCase()}</div>
            <div>
              <strong>{displayName}</strong>
              <span>@{username}</span>
            </div>
          </div>
          <button onClick={() => setActivePage("profile")}>View profile ↗</button>
        </section>

        <div className="side-legal">Made with care ♡</div>
      </aside>

      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

function MobileNav({ activePage, setActivePage }) {
  const items = navigation.filter((item) =>
    ["home", "explore", "messages", "notifications", "profile"].includes(item.id)
  );

  return (
    <nav className="mobile-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={activePage === item.id ? "mobile-selected" : ""}
          onClick={() => setActivePage(item.id)}
          aria-label={item.label}
        >
          <span>{item.icon}</span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
                              }
