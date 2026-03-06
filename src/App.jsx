import { useEffect, useState, useMemo, useRef } from "react";

/* ── Search Icon ─────────────────────────────────────────── */
function SearchIcon({ size = 20, stroke = "#0A84FF" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M15.5 15.5L21 21" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   SEARCH APP — white theme
══════════════════════════════════════════════════════════ */
function SearchApp() {
  const [data,        setData]        = useState([]);
  const [query,       setQuery]       = useState("");
  const [searchText,  setSearchText]  = useState("");
  const [selected,    setSelected]    = useState(null);
  const [error,       setError]       = useState(null);
  const [lastHash,    setLastHash]    = useState("");
  const [showDropdown,setShowDropdown]= useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpjfP-KEtIQi6tHAIRm778RTwxrBWVIO2imWFB4EQNzu-m0S3x7jXdXqfPIJmRjQ/pub?output=csv";

  function hashCSV(t) { return t.length + "_" + (t.charCodeAt(0) || 0); }

  useEffect(() => {
    function parseCSV(text) {
      const lines = text.replace(/\r/g,"").split("\n").filter(l=>l.trim()!=="");
      if(!lines.length) return [];
      const fieldRe = /"(?:[^"]|"")*"|[^,]+|(?<=,)(?=,)/g;
      return lines.map(line=>{
        const m=line.match(fieldRe)||[];
        return m.map(f=>{f=f.trim();if(f.startsWith('"')&&f.endsWith('"'))f=f.slice(1,-1).replace(/""/g,'"');return f;});
      });
    }
    function normalizeHeaders(h){return h.map(x=>(x||"").replace(/\uFEFF/g,"").trim().toUpperCase());}
    function mapRow(h,r){const o={};h.forEach((k,i)=>(o[k]=r[i]??"")); return o;}
    function fetchSheet(){
      fetch(sheetURL+"&cache="+Date.now())
        .then(r=>r.text()).then(csv=>{
          const nh=hashCSV(csv);
          if(nh===lastHash) return;
          setLastHash(nh);
          const rows=parseCSV(csv);
          if(!rows.length) return;
          const headers=normalizeHeaders(rows[0]);
          setData(rows.slice(1).map(r=>mapRow(headers,r)));
        }).catch(()=>setError("Failed to load data sheet"));
    }
    fetchSheet();
    const iv=setInterval(fetchSheet,3000);
    return ()=>clearInterval(iv);
  },[lastHash]);

  useEffect(()=>{
    function h(e){if(dropdownRef.current&&!dropdownRef.current.contains(e.target))setShowDropdown(false);}
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  const itemKey = data.length>0 ? Object.keys(data[0]).find(k=>k.toUpperCase().includes("ITEM")) : null;

  const results = useMemo(()=>{
    if(!query) return [];
    if(query.trim()==="") return data;
    const q=query.toLowerCase();
    return data.filter(item=>Object.values(item).some(v=>(v+"").toLowerCase().includes(q)));
  },[data,query]);

  useEffect(()=>{
    if(query.trim()===""){setSelected(null);return;}
    setSelected(results.length>0?results[0]:null);
  },[results,query]);

  const dropdownSuggestions = itemKey
    ? searchText
      ? data.filter(item=>Object.values(item).some(v=>(v+"").toLowerCase().includes(searchText.toLowerCase())))
      : data
    : [];

  function doSearch(){setQuery(searchText);setShowDropdown(false);}

  /* ── white card ── */
  const card = {
    background:"#ffffff",
    borderRadius:20,
    border:"1px solid #e5e7eb",
    boxShadow:"0 2px 12px rgba(0,0,0,0.05)"
  };

  const sectionCard = {
    background:"#f8faff",
    borderRadius:14,
    border:"1px solid #e8eef8",
    padding:"16px 18px",
    marginBottom:10
  };

  return (
    <div style={{ minHeight:"100vh", position:"relative", zIndex:1, padding:"clamp(14px,4vw,28px)" }}>
      <div style={{ maxWidth:820, margin:"0 auto" }}>

        {/* Header */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"clamp(18px,3vw,32px)", animation:"fadeUp 0.5s both"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:42, height:42, borderRadius:13,
              background:"linear-gradient(135deg,#0A84FF,#0055cc)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 14px rgba(10,132,255,0.28)", flexShrink:0
            }}>
              <SearchIcon size={18} stroke="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:"clamp(17px,3vw,22px)", fontWeight:700, color:"#0d0d0d", letterSpacing:"-0.5px", lineHeight:1.1 }}>
                Search Engine <span style={{ color:"#0A84FF" }}>v2</span>
              </div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
                {data.length>0 ? `${data.length} items loaded` : "Loading…"}
              </div>
            </div>
          </div>


        </div>

        {/* Search box */}
        <div style={{ ...card, padding:"clamp(16px,3vw,24px)", marginBottom:16, animation:"fadeUp 0.5s 0.08s both", position:"relative", zIndex:10 }} ref={dropdownRef}>
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"#9ca3af", marginBottom:10 }}>Search Item</div>
          <div style={{ display:"flex", gap:10, position:"relative" }}>
            <div style={{
              flex:1, display:"flex", alignItems:"center", gap:10,
              background:"#f9fafb", border:"1.5px solid #e5e7eb",
              borderRadius:12, padding:"0 14px", transition:"border-color 0.2s, box-shadow 0.2s"
            }}>
              <span style={{ display:"flex", flexShrink:0 }}><SearchIcon size={16} stroke="#9ca3af"/></span>
              <input
                style={{
                  flex:1, background:"none", border:"none", outline:"none",
                  fontSize:15, color:"#0d0d0d", fontFamily:"inherit",
                  letterSpacing:"-0.2px", padding:"13px 0", caretColor:"#0A84FF"
                }}
                placeholder="Search item name…"
                value={searchText}
                onFocus={()=>{setShowDropdown(true);setActiveIndex(-1);}}
                onChange={e=>{setSearchText(e.target.value);setShowDropdown(true);setActiveIndex(-1);}}
                onKeyDown={e=>{
                  if(e.key===" "&&searchText.trim()===""){setQuery(" ");setShowDropdown(false);return;}
                  if(!dropdownSuggestions.length) return;
                  if(e.key==="ArrowDown"){e.preventDefault();setActiveIndex(p=>Math.min(p+1,dropdownSuggestions.length-1));}
                  if(e.key==="ArrowUp"){e.preventDefault();setActiveIndex(p=>Math.max(p-1,0));}
                  if(e.key==="Enter"){
                    e.preventDefault();
                    if(activeIndex>=0){const it=dropdownSuggestions[activeIndex];setSearchText(it[itemKey]);setQuery(it[itemKey]);}
                    else setQuery(searchText);
                    setShowDropdown(false);
                  }
                  if(e.key==="Escape") setShowDropdown(false);
                }}
              />
              {searchText&&(
                <button onClick={()=>{setSearchText("");setQuery("");setShowDropdown(false);}} style={{
                  background:"none",border:"none",cursor:"pointer",
                  color:"#9ca3af",display:"flex",padding:2,flexShrink:0
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            <button onClick={doSearch} className="search-btn" style={{
              height:48, borderRadius:12,
              background:"linear-gradient(135deg,#0A84FF,#0055cc)",
              border:"none", cursor:"pointer",
              fontSize:14, fontWeight:600, color:"#fff", fontFamily:"inherit",
              flexShrink:0, boxShadow:"0 4px 14px rgba(10,132,255,0.28)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              position:"relative", overflow:"hidden"
            }}>
              <span style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(255,255,255,0.12),transparent)",pointerEvents:"none" }}/>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="search-btn-icon">
                <circle cx="10.5" cy="10.5" r="6.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M15.5 15.5L21 21" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <span className="search-btn-label">Search</span>
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown&&dropdownSuggestions.length>0&&(
            <div style={{
              position:"absolute", left:0, right:0, marginTop:6,
              background:"#fff", border:"1px solid #e5e7eb", borderRadius:14,
              boxShadow:"0 12px 32px rgba(0,0,0,0.10)",
              maxHeight:240, overflowY:"auto", zIndex:50, animation:"fadeUp 0.15s both"
            }}>
              {dropdownSuggestions.map((item,idx)=>(
                <div key={idx} onClick={()=>{setSearchText(item[itemKey]);setQuery(item[itemKey]);setShowDropdown(false);}}
                  style={{
                    padding:"10px 16px", cursor:"pointer", fontSize:14,
                    color: idx===activeIndex?"#0A84FF":"#374151",
                    background: idx===activeIndex?"#EBF4FF":"transparent",
                    borderBottom: idx<dropdownSuggestions.length-1?"1px solid #f3f4f6":"none",
                    display:"flex", alignItems:"center", gap:10,
                    transition:"background 0.1s"
                  }}>
                  <SearchIcon size={13} stroke={idx===activeIndex?"#0A84FF":"#9ca3af"}/>
                  {item[itemKey]}
                </div>
              ))}
            </div>
          )}

          {error&&<p style={{ color:"#dc2626",fontSize:13,marginTop:10,padding:"8px 12px",background:"#fff5f5",borderRadius:8,border:"1px solid #fecaca" }}>{error}</p>}
        </div>

        {/* Result panel */}
        <div style={{ ...card, padding:"clamp(18px,3vw,28px)", minHeight:300, animation:"fadeUp 0.5s 0.14s both", position:"relative", zIndex:0 }}>
          {!query?(
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:240,gap:14 }}>
              <div style={{ opacity:0.18 }}><SearchIcon size={48} stroke="#0A84FF"/></div>
              <p style={{ color:"#9ca3af",fontSize:15 }}>Search to see results</p>
            </div>
          ):!selected?(
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:240,gap:12 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ opacity:0.18 }}>
                <circle cx="12" cy="12" r="10" stroke="#374151" strokeWidth="1.5"/>
                <path d="M8 12h8" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ color:"#9ca3af",fontSize:15 }}>No result found</p>
            </div>
          ):(
            <div style={{ animation:"fadeUp 0.35s both" }}>
              <div style={{ marginBottom:20 }}>
                <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#0A84FF",display:"block",marginBottom:4 }}>Item</span>
                <h2 style={{ fontSize:"clamp(18px,3vw,26px)",fontWeight:700,color:"#0d0d0d",letterSpacing:"-0.6px" }}>{selected[itemKey]}</h2>
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10 }}>
                <div style={sectionCard}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                    <div style={{ width:7,height:7,borderRadius:"50%",background:"#0A84FF",boxShadow:"0 0 7px rgba(10,132,255,0.5)" }}/>
                    <span style={{ fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px" }}>IF Policy (Factory Rate)</span>
                  </div>
                  <p style={{ fontSize:15,color:"#1f2937",lineHeight:1.65 }}>{selected["SHOP POLICY"]||"—"}</p>
                </div>

                <div style={sectionCard}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                    <div style={{ width:7,height:7,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 7px rgba(16,185,129,0.5)" }}/>
                    <span style={{ fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px" }}>IPOD Policy (Shop Rate)</span>
                  </div>
                  <p style={{ fontSize:15,color:"#1f2937",lineHeight:1.65 }}>{selected["IPOD POLICY"]||"—"}</p>
                </div>
              </div>

              <div style={{ ...sectionCard, marginBottom:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:"#f59e0b",boxShadow:"0 0 7px rgba(245,158,11,0.5)" }}/>
                  <span style={{ fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px" }}>Remarks (IF Policy Only)</span>
                </div>
                <p style={{ fontSize:15,color:"#1f2937",lineHeight:1.65 }}>{selected["REMARKS"]||"—"}</p>
              </div>
            </div>
          )}
        </div>

        <footer style={{ textAlign:"center",fontSize:12,color:"#9ca3af",marginTop:20,letterSpacing:"0.2px" }}>
          Created by PRATHAM · Search Engine v2
        </footer>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AMBIENT BACKGROUND — soft white/blue gradient
══════════════════════════════════════════════════════════ */
function AmbientBg() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
      {/* Base */}
      <div style={{ position:"absolute",inset:0,background:"#f0f6ff" }}/>
      {/* Orbs */}
      <div style={{ position:"absolute",width:"60vw",height:"60vw",maxWidth:700,maxHeight:700,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(10,132,255,0.10) 0%,transparent 70%)",
        top:"-10%",left:"-8%",filter:"blur(80px)",animation:"driftA 16s ease-in-out infinite" }}/>
      <div style={{ position:"absolute",width:"50vw",height:"50vw",maxWidth:600,maxHeight:600,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)",
        bottom:"-10%",right:"-8%",filter:"blur(80px)",animation:"driftB 20s ease-in-out infinite" }}/>
      <div style={{ position:"absolute",width:"35vw",height:"35vw",maxWidth:400,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(10,132,255,0.07) 0%,transparent 70%)",
        top:"30%",right:"5%",filter:"blur(70px)",animation:"driftC 22s ease-in-out infinite" }}/>
      {/* Subtle dot grid */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:"radial-gradient(circle,rgba(10,100,220,0.06) 1px,transparent 1px)",
        backgroundSize:"36px 36px"
      }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════ */
export default function App() {
  useEffect(()=>{
    const existing=document.querySelector('meta[name="viewport"]');
    const content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no";
    if(existing) existing.setAttribute("content",content);
    else { const m=document.createElement("meta"); m.name="viewport"; m.content=content; document.head.appendChild(m); }
  },[]);

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        html,body,#root{min-height:100%;touch-action:manipulation;}
        body{
          background:#f0f6ff;
          font-family:-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif;
          color:#0d0d0d;
          -webkit-font-smoothing:antialiased;
          overflow-x:hidden;
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes driftA{0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(4%,5%) scale(1.06);}70%{transform:translate(-3%,-2%) scale(0.96);}}
        @keyframes driftB{0%,100%{transform:translate(0,0) scale(1);}35%{transform:translate(-4%,3%) scale(1.05);}65%{transform:translate(3%,-4%) scale(0.97);}}
        @keyframes driftC{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-5%,6%) scale(1.08);}}
        input::placeholder{color:#9ca3af;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(10,132,255,0.2);border-radius:3px;}
        .search-btn{padding:0 22px;}
        .search-btn-label{display:inline;}
        @media(max-width:480px){
          .search-btn{width:48px;padding:0;}
          .search-btn-label{display:none;}
        }
      `}</style>
      <AmbientBg/>
      <SearchApp/>
    </>
  );
}