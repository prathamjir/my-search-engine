import { useEffect, useState, useMemo, useRef } from "react";

/* ─── Credentials ─────────────────────────────────────────── */
const VALID_USER = "admin11";
const VALID_PASS = "pratham@11";

/* ─── Ambient orbs (shared bg) ───────────────────────────── */
function AmbientBg() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      overflow: "hidden", pointerEvents: "none"
    }}>
      {/* Animated gradient base */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #000000 0%, #020818 25%, #040d2a 50%, #020818 75%, #000000 100%)",
        backgroundSize: "400% 400%",
        animation: "gradShift 12s ease infinite"
      }} />

      {/* Large pulsing blue core */}
      <div style={{
        position: "absolute",
        width: "70vw", height: "70vw",
        maxWidth: 900, maxHeight: 900,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(10,132,255,0.18) 0%, rgba(10,80,200,0.10) 40%, transparent 70%)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        filter: "blur(60px)",
        animation: "pulse 6s ease-in-out infinite"
      }} />

      {/* Top-left orb */}
      <div style={{
        position: "absolute",
        width: "clamp(300px,45vw,650px)", height: "clamp(300px,45vw,650px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(10,132,255,0.22) 0%, rgba(0,80,255,0.08) 50%, transparent 70%)",
        top: "-12%", left: "-8%",
        filter: "blur(80px)",
        animation: "driftA 14s ease-in-out infinite"
      }} />

      {/* Bottom-right orb */}
      <div style={{
        position: "absolute",
        width: "clamp(250px,40vw,580px)", height: "clamp(250px,40vw,580px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,60,255,0.18) 0%, rgba(94,92,230,0.10) 50%, transparent 70%)",
        bottom: "-10%", right: "-8%",
        filter: "blur(80px)",
        animation: "driftB 18s ease-in-out infinite"
      }} />

      {/* Top-right accent */}
      <div style={{
        position: "absolute",
        width: "clamp(150px,28vw,380px)", height: "clamp(150px,28vw,380px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,180,255,0.14) 0%, transparent 65%)",
        top: "5%", right: "10%",
        filter: "blur(70px)",
        animation: "driftC 20s ease-in-out infinite"
      }} />

      {/* Bottom-left accent */}
      <div style={{
        position: "absolute",
        width: "clamp(120px,22vw,300px)", height: "clamp(120px,22vw,300px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(10,132,255,0.12) 0%, transparent 65%)",
        bottom: "12%", left: "8%",
        filter: "blur(60px)",
        animation: "driftD 16s ease-in-out infinite"
      }} />

      {/* Subtle moving beam */}
      <div style={{
        position: "absolute",
        width: "2px", height: "60%",
        background: "linear-gradient(to bottom, transparent, rgba(10,132,255,0.25), transparent)",
        top: "20%", left: "30%",
        filter: "blur(12px)",
        animation: "beam 8s ease-in-out infinite"
      }} />

      {/* Dot grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(100,160,255,0.07) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)"
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)"
      }} />
    </div>
  );
}

/* ─── Search Icon SVG ─────────────────────────────────────── */
function SearchIcon({ size = 22, color = "url(#sgGrad)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="sgGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5E9EFF" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
      </defs>
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15.5 15.5L21 21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   LOGIN SCREEN
══════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      triggerShake("Please fill in all fields.");
      return;
    }
    if (username !== VALID_USER || password !== VALID_PASS) {
      triggerShake("Invalid username or password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => onLogin(), 700);
    }, 1100);
  }

  function triggerShake(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", position: "relative", zIndex: 1
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(16,16,20,0.90)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28,
        padding: "clamp(36px,6vw,52px) clamp(28px,6vw,48px)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
        animation: "cardIn 0.7s cubic-bezier(0.2,0,0,1) both",
        transform: shake ? undefined : undefined,
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: "linear-gradient(145deg,#1a1a2e,#0d0d1a)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(10,132,255,0.22)",
            position: "relative", overflow: "hidden", flexShrink: 0
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 40% 30%, rgba(10,132,255,0.28), transparent 60%)"
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <SearchIcon size={20} />
            </div>
          </div>
          <span style={{
            fontSize: 17, fontWeight: 700, color: "#fff",
            letterSpacing: "-0.4px", fontFamily: "'SF Pro Display',-apple-system,sans-serif"
          }}>Search Engine v2</span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28, animation: "fadeUp 0.6s 0.15s both" }}>
          <h2 style={{
            fontSize: "clamp(24px,4vw,30px)", fontWeight: 700,
            color: "#fff", letterSpacing: "-0.8px", marginBottom: 6,
            fontFamily: "'SF Pro Display',-apple-system,sans-serif"
          }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: "rgba(235,235,245,0.55)", letterSpacing: "-0.1px" }}>
            Sign in to access the search engine
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ animation: shake ? "shake 0.45s ease" : undefined }}>

          {/* Field group */}
          <div style={{
            background: "rgba(28,28,32,0.88)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, overflow: "hidden", marginBottom: 12
          }}>
            {/* Username */}
            <div style={{
              display: "flex", alignItems: "center",
              padding: "0 16px", height: 54, gap: 12,
              borderBottom: "0.5px solid rgba(84,84,88,0.5)"
            }}>
              <span style={{ color: "rgba(235,235,245,0.28)", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(235,235,245,0.28)", marginBottom: 2 }}>Username</div>
                <input
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  placeholder="Enter your username"
                  autoComplete="username"
                  style={{
                    background: "none", border: "none", outline: "none",
                    fontSize: 15, color: "#fff", fontFamily: "inherit",
                    letterSpacing: "-0.2px", width: "100%",
                    caretColor: "#0A84FF"
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 54, gap: 12 }}>
              <span style={{ color: "rgba(235,235,245,0.28)", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(235,235,245,0.28)", marginBottom: 2 }}>Password</div>
                <input
                  id="pwd"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    background: "none", border: "none", outline: "none",
                    fontSize: 15, color: "#fff", fontFamily: "inherit",
                    letterSpacing: "-0.2px", width: "100%",
                    caretColor: "#0A84FF"
                  }}
                />
              </div>
              <button type="button" onClick={() => setShowPwd(v => !v)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(235,235,245,0.35)", display: "flex", padding: 4,
                borderRadius: 6, transition: "color 0.15s"
              }}>
                {showPwd ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10 10 0 0112 20c-7 0-11-8-11-8a18 18 0 015.06-5.94M9.9 4.24A9 9 0 0112 4c7 0 11 8 11 8a18 18 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontSize: 13, color: "#FF453A", marginBottom: 12,
              padding: "8px 12px", background: "rgba(255,69,58,0.1)",
              borderRadius: 8, border: "1px solid rgba(255,69,58,0.2)",
              animation: "fadeUp 0.3s both"
            }}>{error}</p>
          )}

          {/* Submit */}
          <button type="submit" style={{
            width: "100%", height: 52, borderRadius: 14,
            background: success ? "#30D158" : "#0A84FF",
            border: "none", cursor: loading ? "default" : "pointer",
            fontSize: 16, fontWeight: 600, color: "#fff",
            fontFamily: "inherit", letterSpacing: "-0.3px",
            opacity: loading && !success ? 0.65 : 1,
            transition: "background 0.3s, box-shadow 0.3s, opacity 0.15s, transform 0.12s",
            boxShadow: success
              ? "0 8px 28px rgba(48,209,88,0.32)"
              : "0 8px 28px rgba(10,132,255,0.30)",
            position: "relative", overflow: "hidden",
            marginTop: 4
          }}>
            <span style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
              pointerEvents: "none"
            }} />
            {success ? "✓  Welcome!" : loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={{
          textAlign: "center", marginTop: 24,
          fontSize: 12, color: "rgba(235,235,245,0.25)", lineHeight: 1.6
        }}>
          Search Engine v2 · Secure Access
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SEARCH ENGINE APP
══════════════════════════════════════════════════════════ */
function SearchApp({ onLogout }) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [lastHash, setLastHash] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpjfP-KEtIQi6tHAIRm778RTwxrBWVIO2imWFB4EQNzu-m0S3x7jXdXqfPIJmRjQ/pub?output=csv";

  function hashCSV(text) {
    return text.length + "_" + (text.charCodeAt(0) || 0);
  }

  useEffect(() => {
    function parseCSV(text) {
      const lines = text.replace(/\r/g, "").split("\n").filter(l => l.trim() !== "");
      if (!lines.length) return [];
      const fieldRe = /"(?:[^"]|"")*"|[^,]+|(?<=,)(?=,)/g;
      return lines.map(line => {
        const matches = line.match(fieldRe) || [];
        return matches.map(f => {
          f = f.trim();
          if (f.startsWith('"') && f.endsWith('"')) f = f.slice(1, -1).replace(/""/g, '"');
          return f;
        });
      });
    }
    function normalizeHeaders(headers) {
      return headers.map(h => (h || "").replace(/\uFEFF/g, "").trim().toUpperCase());
    }
    function mapRow(headers, row) {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i] ?? ""));
      return obj;
    }
    function fetchSheet() {
      fetch(sheetURL + "&cache=" + Date.now())
        .then(res => res.text())
        .then(csv => {
          const newHash = hashCSV(csv);
          if (newHash === lastHash) return;
          setLastHash(newHash);
          const rows = parseCSV(csv);
          if (!rows.length) return;
          const headers = normalizeHeaders(rows[0]);
          const json = rows.slice(1).map(r => mapRow(headers, r));
          setData(json);
        })
        .catch(() => setError("Failed to load data sheet"));
    }
    fetchSheet();
    const interval = setInterval(fetchSheet, 3000);
    return () => clearInterval(interval);
  }, [lastHash]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const itemKey = data.length > 0
    ? Object.keys(data[0]).find(k => k.toUpperCase().includes("ITEM"))
    : null;

  const results = useMemo(() => {
    if (!query) return [];
    if (query.trim() === "") return data;
    const q = query.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(val => (val + "").toLowerCase().includes(q))
    );
  }, [data, query]);

  useEffect(() => {
    if (query.trim() === "") { setSelected(null); return; }
    setSelected(results.length > 0 ? results[0] : null);
  }, [results, query]);

  const dropdownSuggestions = itemKey
    ? searchText
      ? data.filter(item =>
          Object.values(item).some(val =>
            (val + "").toLowerCase().includes(searchText.toLowerCase())
          )
        )
      : data  // show ALL records when input is focused but empty
    : [];

  function doSearch() {
    setQuery(searchText);
    setShowDropdown(false);
  }

  /* ── styles ── */
  const cardStyle = {
    background: "rgba(18,18,22,0.88)",
    backdropFilter: "blur(30px) saturate(160%)",
    WebkitBackdropFilter: "blur(30px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
  };

  const labelStyle = {
    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.8px", color: "rgba(235,235,245,0.35)",
    marginBottom: 6, display: "block"
  };

  const sectionStyle = {
    ...cardStyle,
    padding: "18px 20px",
    marginBottom: 12
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1, padding: "clamp(16px,4vw,32px)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "clamp(24px,4vw,40px)",
          animation: "fadeUp 0.6s both"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(145deg,#1a1a2e,#0d0d1a)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(10,132,255,0.2)",
              position: "relative", overflow: "hidden", flexShrink: 0
            }}>
              <div style={{ position:"absolute",inset:0, background:"radial-gradient(ellipse at 40% 30%, rgba(10,132,255,0.25), transparent 60%)" }} />
              <div style={{ position:"relative", zIndex:1 }}><SearchIcon size={18} /></div>
            </div>
            <div>
              <div style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                Search Engine <span style={{ background: "linear-gradient(135deg,#5E9EFF,#0A84FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>v2</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(235,235,245,0.4)", letterSpacing: "0.3px", marginTop: 1 }}>
                {data.length > 0 ? `${data.length} items loaded` : "Loading…"}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={onLogout} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,69,58,0.08)", border: "1px solid rgba(255,69,58,0.18)",
            borderRadius: 10, padding: "8px 14px", cursor: "pointer",
            color: "#FF453A", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
            transition: "background 0.15s, border-color 0.15s"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* ── Search Box ── */}
        <div style={{ ...cardStyle, padding: "clamp(18px,3vw,28px)", marginBottom: 20, animation: "fadeUp 0.6s 0.1s both", position: "relative", zIndex: 10 }} ref={dropdownRef}>
          <label style={labelStyle}>Search Item</label>
          <div style={{ display: "flex", gap: 10, position: "relative" }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 12, padding: "0 14px", transition: "border-color 0.2s",
            }}
              onFocus={() => {}} 
            >
              <span style={{ color: "rgba(235,235,245,0.35)", display:"flex", flexShrink:0 }}>
                <SearchIcon size={16} color="rgba(235,235,245,0.35)" />
              </span>
              <input
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontSize: 15, color: "#fff", fontFamily: "inherit",
                  letterSpacing: "-0.2px", padding: "13px 0",
                  caretColor: "#0A84FF"
                }}
                placeholder="Search item name…"
                value={searchText}
                onFocus={() => {
                  setShowDropdown(true);
                  setActiveIndex(-1);
                }}
                onChange={e => {
                  setSearchText(e.target.value);
                  setShowDropdown(true);
                  setActiveIndex(-1);
                }}
                onKeyDown={e => {
                  if (e.key === " " && searchText.trim() === "") {
                    setQuery(" "); setShowDropdown(false); return;
                  }
                  if (!dropdownSuggestions.length) return;
                  if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(p => Math.min(p + 1, dropdownSuggestions.length - 1)); }
                  if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex(p => Math.max(p - 1, 0)); }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (activeIndex >= 0) {
                      const item = dropdownSuggestions[activeIndex];
                      setSearchText(item[itemKey]); setQuery(item[itemKey]);
                    } else { setQuery(searchText); }
                    setShowDropdown(false);
                  }
                  if (e.key === "Escape") setShowDropdown(false);
                }}
              />
              {searchText && (
                <button onClick={() => { setSearchText(""); setQuery(""); setShowDropdown(false); }} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(235,235,245,0.35)", display:"flex", padding:2, flexShrink:0
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            <button onClick={doSearch} className="search-btn" style={{
              height: 48, borderRadius: 12,
              background: "#0A84FF", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "inherit",
              letterSpacing: "-0.2px", flexShrink: 0,
              boxShadow: "0 6px 20px rgba(10,132,255,0.28)",
              transition: "opacity 0.15s, transform 0.12s",
              position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7
            }}>
              <span style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(255,255,255,0.1),transparent)",pointerEvents:"none" }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="search-btn-icon">
                <circle cx="10.5" cy="10.5" r="6.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M15.5 15.5L21 21" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <span className="search-btn-label">Search</span>
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && dropdownSuggestions.length > 0 && (
            <div style={{
              position: "absolute", left: 0, right: 0, marginTop: 6,
              background: "rgba(22,22,26,0.97)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
              maxHeight: 240, overflowY: "auto", zIndex: 50,
              animation: "fadeUp 0.2s both"
            }}>
              {dropdownSuggestions.map((item, idx) => (
                <div key={idx} onClick={() => {
                  setSearchText(item[itemKey]); setQuery(item[itemKey]); setShowDropdown(false);
                }} style={{
                  padding: "11px 16px", cursor: "pointer", fontSize: 14,
                  color: idx === activeIndex ? "#fff" : "rgba(235,235,245,0.75)",
                  background: idx === activeIndex ? "rgba(10,132,255,0.18)" : "transparent",
                  borderBottom: idx < dropdownSuggestions.length - 1 ? "0.5px solid rgba(84,84,88,0.3)" : "none",
                  transition: "background 0.1s",
                  display: "flex", alignItems: "center", gap: 10
                }}>
                  <span style={{ color: "rgba(235,235,245,0.3)", display:"flex" }}><SearchIcon size={13} color="rgba(235,235,245,0.3)" /></span>
                  {item[itemKey]}
                </div>
              ))}
            </div>
          )}

          {error && (
            <p style={{ color: "#FF453A", fontSize: 13, marginTop: 10, padding:"8px 12px", background:"rgba(255,69,58,0.08)", borderRadius:8 }}>{error}</p>
          )}
        </div>

        {/* ── Result Panel ── */}
        <div style={{ ...cardStyle, padding: "clamp(20px,3vw,32px)", minHeight: 320, animation: "fadeUp 0.6s 0.18s both", position: "relative", zIndex: 0 }}>
          {!query ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:260, gap:16 }}>
              <div style={{ opacity: 0.15 }}><SearchIcon size={48} color="#fff" /></div>
              <p style={{ color:"rgba(235,235,245,0.35)", fontSize:15, letterSpacing:"-0.2px" }}>Search to see results</p>
            </div>
          ) : !selected ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:260, gap:12 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ opacity:0.15 }}>
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" style={{ transform:"rotate(45deg)", transformOrigin:"center" }} />
              </svg>
              <p style={{ color:"rgba(235,235,245,0.35)", fontSize:15 }}>No result found</p>
            </div>
          ) : (
            <div style={{ animation: "fadeUp 0.4s both" }}>
              {/* Item name */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform:"uppercase", letterSpacing:"0.8px", color:"rgba(10,132,255,0.7)", marginBottom: 6, display:"block" }}>Item</span>
                <h2 style={{
                  fontSize: "clamp(20px,3vw,28px)", fontWeight: 700,
                  color: "#fff", letterSpacing: "-0.7px", lineHeight: 1.2
                }}>{selected[itemKey]}</h2>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:12 }}>
                {/* IF Policy */}
                <div style={sectionStyle}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#0A84FF", boxShadow:"0 0 8px rgba(10,132,255,0.6)" }} />
                    <span style={{ fontSize:12, fontWeight:600, color:"rgba(235,235,245,0.5)", textTransform:"uppercase", letterSpacing:"0.5px" }}>IF Policy (Factory Rate)</span>
                  </div>
                  <p style={{ fontSize:15, color:"rgba(235,235,245,0.88)", lineHeight:1.6, letterSpacing:"-0.1px" }}>
                    {selected["SHOP POLICY"] || "—"}
                  </p>
                </div>

                {/* IPOD Policy */}
                <div style={sectionStyle}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#30D158", boxShadow:"0 0 8px rgba(48,209,88,0.6)" }} />
                    <span style={{ fontSize:12, fontWeight:600, color:"rgba(235,235,245,0.5)", textTransform:"uppercase", letterSpacing:"0.5px" }}>IPOD Policy (Shop Rate)</span>
                  </div>
                  <p style={{ fontSize:15, color:"rgba(235,235,245,0.88)", lineHeight:1.6, letterSpacing:"-0.1px" }}>
                    {selected["IPOD POLICY"] || "—"}
                  </p>
                </div>
              </div>

              {/* Remarks */}
              <div style={{ ...sectionStyle, marginBottom: 0, marginTop: 0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF9F0A", boxShadow:"0 0 8px rgba(255,159,10,0.6)" }} />
                  <span style={{ fontSize:12, fontWeight:600, color:"rgba(235,235,245,0.5)", textTransform:"uppercase", letterSpacing:"0.5px" }}>Remarks (IF Policy Only)</span>
                </div>
                <p style={{ fontSize:15, color:"rgba(235,235,245,0.88)", lineHeight:1.6, letterSpacing:"-0.1px" }}>
                  {selected["REMARKS"] || "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        <footer style={{ textAlign:"center", fontSize:12, color:"rgba(235,235,245,0.22)", marginTop:24, letterSpacing:"0.2px" }}>
          Created by PRATHAM · Search Engine v2
        </footer>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT — AUTH GATE
══════════════════════════════════════════════════════════ */
export default function App() {
  const [authed, setAuthed] = useState(false);

  return (
    <>
      {/* Global styles */}
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html,body,#root { min-height:100%; }
        body {
          background:#000d1f;
          font-family: -apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif;
          color:#fff;
          -webkit-font-smoothing:antialiased;
          overflow-x:hidden;
        }
        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
          50%      { transform: translate(-50%,-50%) scale(1.18); opacity: 0.7; }
        }
        @keyframes beam {
          0%,100% { transform: translateX(0) scaleY(1); opacity: 0.4; }
          50%      { transform: translateX(40vw) scaleY(1.3); opacity: 0.15; }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(28px) scale(0.98); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes driftA {
          0%,100% { transform:translate(0,0) scale(1); }
          40%     { transform:translate(6%,5%) scale(1.08); }
          70%     { transform:translate(-4%,-3%) scale(0.95); }
        }
        @keyframes driftB {
          0%,100% { transform:translate(0,0) scale(1); }
          35%     { transform:translate(-5%,4%) scale(1.06); }
          65%     { transform:translate(4%,-5%) scale(0.97); }
        }
        @keyframes driftC {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(-6%,8%) scale(1.1); }
        }
        @keyframes driftD {
          0%,100% { transform:translate(0,0) scale(1); }
          45%     { transform:translate(5%,-6%) scale(1.05); }
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-7px); }
          40%     { transform:translateX(7px); }
          60%     { transform:translateX(-4px); }
          80%     { transform:translateX(4px); }
        }
        input::placeholder { color:rgba(235,235,245,0.25); }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(10,132,255,0.3); border-radius:3px; }
        .search-btn { padding: 0 22px; }
        .search-btn-label { display: inline; }
        @media (max-width: 480px) {
          .search-btn { width: 48px; padding: 0; }
          .search-btn-label { display: none; }
        }
      `}</style>

      <AmbientBg />

      {authed
        ? <SearchApp onLogout={() => setAuthed(false)} />
        : <LoginScreen onLogin={() => setAuthed(true)} />
      }
    </>
  );
}