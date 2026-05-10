import React, { useState, useRef, useEffect } from "react";

const CLIPS = [
  { id: 1, title: "You Can't Handle the Truth", source: "A Few Good Men", category: "Movies", plays: "2.4M", emoji: "⚖️", duration: "0:03", color: "#FF6B35" },
  { id: 2, title: "I'll Be Back", source: "The Terminator", category: "Movies", plays: "5.1M", emoji: "🤖", duration: "0:02", color: "#6C63FF" },
  { id: 3, title: "To Infinity and Beyond", source: "Toy Story", category: "Movies", plays: "3.8M", emoji: "🚀", duration: "0:02", color: "#00D4AA" },
  { id: 4, title: "Why So Serious?", source: "The Dark Knight", category: "Movies", plays: "4.2M", emoji: "🃏", duration: "0:03", color: "#FF3366" },
  { id: 5, title: "That's What She Said", source: "The Office", category: "TV", plays: "6.7M", emoji: "😏", duration: "0:02", color: "#FFB800" },
  { id: 6, title: "How You Doin?", source: "Friends", category: "TV", plays: "3.3M", emoji: "😎", duration: "0:02", color: "#00B4D8" },
  { id: 7, title: "Winter Is Coming", source: "Game of Thrones", category: "TV", plays: "2.9M", emoji: "❄️", duration: "0:02", color: "#6C63FF" },
  { id: 8, title: "Yeet", source: "User Created", category: "Viral", plays: "8.1M", emoji: "🔥", duration: "0:01", color: "#FF6B35" },
  { id: 9, title: "Oh Yeah", source: "Ferris Bueller", category: "Movies", plays: "4.5M", emoji: "😄", duration: "0:02", color: "#00D4AA" },
  { id: 10, title: "Cha-Ching", source: "User Created", category: "Viral", plays: "3.1M", emoji: "💰", duration: "0:01", color: "#FFB800" },
  { id: 11, title: "Bazinga!", source: "Big Bang Theory", category: "TV", plays: "5.5M", emoji: "⚡", duration: "0:02", color: "#6C63FF" },
];

const CATEGORIES = ["All", "Movies", "TV", "Viral", "Music", "User Created"];
const MY_LIBRARY = [0, 4, 7, 8];

export default function App() {
  const [activeTab, setActiveTab] = useState("discover");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedClips, setSavedClips] = useState(MY_LIBRARY);
  const [playingId, setPlayingId] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, from: "them", text: "Did you watch the game last night?? 😭" },
    { id: 2, from: "me", text: "bro I can't even talk about it" },
    { id: 3, from: "them", text: "we needed a miracle" },
  ]);
  const [showSendConfirm, setShowSendConfirm] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingDone, setRecordingDone] = useState(false);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const filtered = CLIPS.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.source.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const toggleSave = (clip) => {
    if (savedClips.includes(clip.id)) {
      setSavedClips(prev => prev.filter(id => id !== clip.id));
      showToast("Removed from library");
    } else {
      setSavedClips(prev => [...prev, clip.id]);
      showToast("Saved to your library");
    }
  };

  const togglePlay = (id) => {
    setPlayingId(prev => prev === id ? null : id);
    setTimeout(() => setPlayingId(null), 2000);
  };

  const sendClip = (clip) => {
    setMessages(prev => [...prev, { id: prev.length + 1, from: "me", isClip: true, clip }]);
    setShowSendConfirm(null);
    setActiveTab("messages");
    showToast("Sent!");
  };

  const startRecording = () => {
    setRecording(true);
    setRecordingSeconds(0);
    setRecordingDone(false);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(s => {
        if (s >= 5) { clearInterval(timerRef.current); setRecording(false); setRecordingDone(true); return s; }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    setRecordingDone(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const myLibraryClips = CLIPS.filter(c => savedClips.includes(c.id));

  return (
    <div style={{ fontFamily: "sans-serif", background: "#0A0A0F", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
      {toastMsg && (
        <div style={{ position: "fixed", top: 30, left: "50%", transform: "translateX(-50%)", background: "#1E1E2E", color: "#fff", padding: "10px 20px", borderRadius: 20, fontSize: 13, zIndex: 9999, border: "1px solid rgba(255,255,255,0.1)" }}>
          {toastMsg}
        </div>
      )}
      <div style={{ width: 375, minHeight: 780, background: "#12121A", borderRadius: 44, overflow: "hidden", position: "relative", boxShadow: "0 40px 120px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 24px 0", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>9:41</span>
          <span style={{ color: "#fff", fontSize: 11 }}>●●●</span>
        </div>
        <div style={{ padding: "16px 24px 12px" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>Echo<span style={{ color: "#6C63FF" }}>Clip</span></div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            {activeTab === "discover" ? "Discover sounds" : activeTab === "library" ? "Your library" : activeTab === "record" ? "Create your own" : "Live preview"}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>
          {activeTab === "discover" && (
            <div>
              <div style={{ padding: "0 16px 12px" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "10px 14px", display: "flex", gap: 8 }}>
                  <span style={{ opacity: 0.4 }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sounds..." style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, flex: 1 }} />
                </div>
              </div>
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? "#6C63FF" : "rgba(255,255,255,0.06)", color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.5)", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {cat}
                  </button>
                ))}
              </div>
              <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map(clip => (
                  <ClipCard key={clip.id} clip={clip} isPlaying={playingId === clip.id} isSaved={savedClips.includes(clip.id)} onPlay={() => togglePlay(clip.id)} onSave={() => toggleSave(clip)} onSend={() => setShowSendConfirm(clip)} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "library" && (
            <div style={{ padding: "0 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>YOUR CLIPS</div>
              {myLibraryClips.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Save clips from Discover to build your library</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {myLibraryClips.map(clip => (
                    <ClipCard key={clip.id} clip={clip} isPlaying={playingId === clip.id} isSaved={true} onPlay={() => togglePlay(clip.id)} onSave={() => toggleSave(clip)} onSend={() => setShowSendConfirm(clip)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "record" && (
            <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 32 }}>Record your own sound clip and share it</div>
              <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} style={{ width: 120, height: 120, borderRadius: "50%", background: recording ? "#FF3366" : "rgba(255,51,102,0.15)", border: "3px solid rgba(255,51,102,0.4)", cursor: "pointer", fontSize: 40, marginBottom: 20 }}>
                🎙️
              </button>
              {recording && <div style={{ color: "#FF3366", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recording... {recordingSeconds}s</div>}
              {!recording && !recordingDone && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 16 }}>Hold to record</div>}
              {recordingDone && (
                <div style={{ width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ color: "#00D4AA", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recording captured!</div>
                  <input placeholder="Name your clip..." style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setRecordingDone(false); showToast("Shared to community!"); }} style={{ flex: 1, background: "#6C63FF", border: "none", borderRadius: 10, color: "#fff", padding: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Share</button>
                    <button onClick={() => { setRecordingDone(false); showToast("Saved privately"); }} style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, color: "#fff", padding: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Keep Private</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div style={{ padding: "0 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6C63FF, #FF6B35)", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Marcus</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>iMessage</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                    {msg.isClip ? (
                      <div style={{ background: "linear-gradient(135deg, #6C63FF, #5A54E8)", borderRadius: 18, padding: "10px 14px", maxWidth: "75%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 20 }}>{msg.clip.emoji}</span>
                          <div>
                            <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{msg.clip.title}</div>
                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>EchoClip</div>
                          </div>
                          <span>▶️</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: msg.from === "me" ? "#6C63FF" : "rgba(255,255,255,0.08)", color: "#fff", borderRadius: 18, padding: "10px 14px", maxWidth: "75%", fontSize: 13 }}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ background: "rgba(108,99,255,0.1)", borderRadius: 16, padding: 12, border: "1px solid rgba(108,99,255,0.3)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(108,99,255,0.8)", marginBottom: 10 }}>YOUR ECHOCLIPS</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                  {myLibraryClips.map(clip => (
                    <button key={clip.id} onClick={() => sendClip(clip)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 10px", cursor: "pointer", minWidth: 72, flexShrink: 0 }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{clip.emoji}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{clip.title.slice(0, 12)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(18,18,26,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", padding: "10px 0 20px" }}>
          {[{ id: "discover", icon: "🔍", label: "Discover" }, { id: "library", icon: "📚", label: "Library" }, { id: "record", icon: "🎙️", label: "Record" }, { id: "messages", icon: "💬", label: "Messages" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: activeTab === tab.id ? 1 : 0.4 }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, color: activeTab === tab.id ? "#6C63FF" : "#fff", fontWeight: 600 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showSendConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: "0 20px 40px" }} onClick={() => setShowSendConfirm(null)}>
          <div style={{ background: "#1A1A2E", borderRadius: 24, padding: 24, width: "100%", maxWidth: 375, border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>{showSendConfirm.emoji}</span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{showSendConfirm.title}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{showSendConfirm.source}</div>
              </div>
            </div>
            <button onClick={() => sendClip(showSendConfirm)} style={{ width: "100%", background: "#6C63FF", border: "none", borderRadius: 14, color: "#fff", padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>Send in Messages 💬</button>
            <button onClick={() => setShowSendConfirm(null)} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 14, color: "rgba(255,255,255,0.5)", padding: 14, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClipCard({ clip, isPlaying, isSaved, onPlay, onSave, onSend }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onPlay} style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: isPlaying ? clip.color : `${clip.color}22`, border: `2px solid ${clip.color}55`, cursor: "pointer", fontSize: 18 }}>
        {isPlaying ? "⏹" : clip.emoji}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.title}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{clip.source} · {clip.plays} plays</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onSave} style={{ width: 32, height: 32, borderRadius: 10, background: isSaved ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", fontSize: 14, color: isSaved ? "#00D4AA" : "#fff" }}>{isSaved ? "✓" : "+"}</button>
        <button onClick={onSend} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(108,99,255,0.15)", border: "none", cursor: "pointer", fontSize: 14 }}>💬</button>
      </div>
    </div>
  );
}
