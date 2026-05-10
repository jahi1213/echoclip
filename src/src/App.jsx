import React, { useState, useRef, useEffect } from "react";

const CLIPS = [
  { id: 1, title: "You Can't Handle the Truth", source: "A Few Good Men", category: "Movies", plays: "2.4M", emoji: "⚖️", duration: "0:03", color: "#FF6B35" },
  { id: 2, title: "I'll Be Back", source: "The Terminator", category: "Movies", plays: "5.1M", emoji: "🤖", duration: "0:02", color: "#6C63FF" },
  { id: 3, title: "To Infinity and Beyond", source: "Toy Story", category: "Movies", plays: "3.8M", emoji: "🚀", duration: "0:02", color: "#00D4AA" },
  { id: 4, title: "Why So Serious?", source: "The Dark Knight", category: "Movies", plays: "4.2M", emoji: "🃏", duration: "0:03", color: "#FF3366" },
  { id: 5, title: "That's What She Said", source: "The Office", category: "TV", plays: "6.7M", emoji: "😏", duration: "0:02", color: "#FFB800" },
  { id: 6, title: "How You Doin'?", source: "Friends", category: "TV", plays: "3.3M", emoji: "😎", duration: "0:02", color: "#00B4D8" },
  { id: 7, title: "Winter Is Coming", source: "Game of Thrones", category: "TV", plays: "2.9M", emoji: "❄️", duration: "0:02", color: "#6C63FF" },
  { id: 8, title: "Yeet", source: "User Created", category: "Viral", plays: "8.1M", emoji: "🔥", duration: "0:01", color: "#FF6B35" },
  { id: 9, title: "We're Not Gonna Take It", source: "Twisted Sister", category: "Music", plays: "1.2M", emoji: "🎸", duration: "0:04", color: "#FF3366" },
  { id: 10, title: "Oh Yeah", source: "Ferris Bueller", category: "Movies", plays: "4.5M", emoji: "😄", duration: "0:02", color: "#00D4AA" },
  { id: 11, title: "Cha-Ching", source: "User Created", category: "Viral", plays: "3.1M", emoji: "💰", duration: "0:01", color: "#FFB800" },
  { id: 12, title: "Bazinga!", source: "Big Bang Theory", category: "TV", plays: "5.5M", emoji: "⚡", duration: "0:02", color: "#6C63FF" },
];

const CATEGORIES = ["All", "Movies", "TV", "Viral", "Music", "User Created"];

const MY_LIBRARY = [CLIPS[0], CLIPS[4], CLIPS[7], CLIPS[9]];

const MESSAGES = [
  { id: 1, from: "them", text: "Did you watch the game last night?? 😭", time: "9:41 AM" },
  { id: 2, from: "me", text: "bro I can't even talk about it", time: "9:42 AM" },
  { id: 3, from: "them", text: "we needed a miracle", time: "9:42 AM" },
];

export default function EchoClip() {
  const [activeTab, setActiveTab] = useState("discover");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedClips, setSavedClips] = useState(MY_LIBRARY.map(c => c.id));
  const [playingId, setPlayingId] = useState(null);
  const [sentClip, setSentClip] = useState(null);
  const [messages, setMessages] = useState(MESSAGES);
  const [showSendConfirm, setShowSendConfirm] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingDone, setRecordingDone] = useState(false);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const filtered = CLIPS.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.source.toLowerCase().includes(search.toLowerCase());
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
      showToast("Saved to your library ✓");
    }
  };

  const togglePlay = (id) => {
    setPlayingId(prev => prev === id ? null : id);
    if (playingId !== id) {
      setTimeout(() => setPlayingId(null), 2000);
    }
  };

  const sendClip = (clip) => {
    const newMsg = {
      id: messages.length + 1,
      from: "me",
      isClip: true,
      clip,
      time: "now",
    };
    setMessages(prev => [...prev, newMsg]);
    setSentClip(clip.id);
    setShowSendConfirm(null);
    setActiveTab("messages");
    showToast(`"${clip.title}" sent! 🎵`);
    setTimeout(() => setSentClip(null), 3000);
  };

  const startRecording = () => {
    setRecording(true);
    setRecordingSeconds(0);
    setRecordingDone(false);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(s => {
        if (s >= 5) {
          clearInterval(timerRef.current);
          setRecording(false);
          setRecordingDone(true);
          return s;
        }
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
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#0A0A0F",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)" }} />
      </div>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 30, left: "50%", transform: "translateX(-50%)",
          background: "#1E1E2E", color: "#fff", padding: "10px 20px", borderRadius: 20,
          fontSize: 13, fontWeight: 500, zIndex: 9999, border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", whiteSpace: "nowrap",
          animation: "fadeInDown 0.3s ease",
        }}>
          {toastMsg}
        </div>
      )}

      {/* Phone frame */}
      <div style={{
        width: 375, minHeight: 780, background: "#12121A",
        borderRadius: 44, overflow: "hidden", position: "relative",
        boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)",
        display: "flex", flexDirection: "column",
        zIndex: 1,
      }}>
        {/* Status bar */}
        <div style={{ padding: "14px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>9:41</span>
          <div style={{ width: 120, height: 30, background: "#000", borderRadius: 20, border: "2px solid rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#fff" }}>●●●</span>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "16px 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>
                Echo<span style={{ color: "#6C63FF" }}>Clip</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2, fontWeight: 500 }}>
                {activeTab === "discover" ? "Discover sounds" : activeTab === "library" ? "Your library" : activeTab === "record" ? "Create your own" : "Live preview"}
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(108,99,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              🎵
            </div>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>

          {/* DISCOVER TAB */}
          {activeTab === "discover" && (
            <div>
              {/* Search */}
              <div style={{ padding: "0 16px 12px" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, opacity: 0.4 }}>🔍</span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search sounds, movies, shows..."
                    style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, flex: 1, fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
              </div>

              {/* Categories */}
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                    background: activeCategory === cat ? "#6C63FF" : "rgba(255,255,255,0.06)",
                    color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.5)",
                    border: "none", borderRadius: 20, padding: "6px 14px",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Trending label */}
              <div style={{ padding: "0 16px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase" }}>🔥 Trending</span>
              </div>

              {/* Clips grid */}
              <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map(clip => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    isPlaying={playingId === clip.id}
                    isSaved={savedClips.includes(clip.id)}
                    onPlay={() => togglePlay(clip.id)}
                    onSave={() => toggleSave(clip)}
                    onSend={() => setShowSendConfirm(clip)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* LIBRARY TAB */}
          {activeTab === "library" && (
            <div style={{ padding: "0 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
                YOUR CLIPS · {myLibraryClips.length}
              </div>
              {myLibraryClips.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  Save clips from Discover to build your library
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {myLibraryClips.map(clip => (
                    <ClipCard
                      key={clip.id}
                      clip={clip}
                      isPlaying={playingId === clip.id}
                      isSaved={true}
                      onPlay={() => togglePlay(clip.id)}
                      onSave={() => toggleSave(clip)}
                      onSend={() => setShowSendConfirm(clip)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RECORD TAB */}
          {activeTab === "record" && (
            <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 32, lineHeight: 1.6 }}>
                Record your own sound clip and share it with the EchoClip community
              </div>

              {/* Big record button */}
              <div style={{ position: "relative", marginBottom: 32 }}>
                {recording && (
                  <div style={{
                    position: "absolute", inset: -16, borderRadius: "50%",
                    border: "2px solid rgba(255,51,102,0.5)",
                    animation: "ping 1s ease-in-out infinite",
                  }} />
                )}
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  style={{
                    width: 120, height: 120, borderRadius: "50%",
                    background: recording ? "#FF3366" : "rgba(255,51,102,0.15)",
                    border: `3px solid ${recording ? "#FF3366" : "rgba(255,51,102,0.4)"}`,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 40, transition: "all 0.2s", transform: recording ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  🎙️
                </button>
              </div>

              {recording && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3366", animation: "blink 1s ease-in-out infinite" }} />
                  <span style={{ color: "#FF3366", fontSize: 14, fontWeight: 600 }}>Recording... {recordingSeconds}s</span>
                </div>
              )}

              {!recording && !recordingDone && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 16 }}>Hold to record</div>
              )}

              {recordingDone && (
                <div style={{ width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ color: "#00D4AA", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>✓ Recording captured!</div>
                  <input
                    placeholder="Name your clip..."
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10, boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setRecordingDone(false); showToast("Clip uploaded to community! 🎵"); }} style={{
                      flex: 1, background: "#6C63FF", border: "none", borderRadius: 10,
                      color: "#fff", padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Share to Community
                    </button>
                    <button onClick={() => { setRecordingDone(false); showToast("Saved to your library ✓"); }} style={{
                      flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10,
                      color: "#fff", padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Keep Private
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 32, width: "100%" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
                  TIPS FOR GREAT CLIPS
                </div>
                {["Keep it under 5 seconds", "Clear audio, minimal background noise", "Memorable, reusable moments", "Funny beats profound every time"].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(108,99,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#6C63FF", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === "messages" && (
            <div style={{ padding: "0 16px" }}>
              {/* Contact header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6C63FF, #FF6B35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Marcus</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>iMessage</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                    {msg.isClip ? (
                      <div style={{
                        background: "linear-gradient(135deg, #6C63FF, #5A54E8)",
                        borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        padding: "10px 14px", maxWidth: "75%",
                        boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                            {msg.clip.emoji}
                          </div>
                          <div>
                            <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{msg.clip.title}</div>
                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>EchoClip · {msg.clip.source}</div>
                          </div>
                          <div style={{ marginLeft: 4, fontSize: 16 }}>▶️</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: msg.from === "me" ? "#6C63FF" : "rgba(255,255,255,0.08)",
                        color: "#fff", borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        padding: "10px 14px", maxWidth: "75%", fontSize: 13, lineHeight: 1.4,
                      }}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* EchoClip send bar */}
              <div style={{ background: "rgba(108,99,255,0.1)", borderRadius: 16, padding: 12, border: "1px solid rgba(108,99,255,0.3)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(108,99,255,0.8)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                  🎵 Your EchoClips
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                  {myLibraryClips.map(clip => (
                    <button key={clip.id} onClick={() => sendClip(clip)} style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12, padding: "8px 10px", cursor: "pointer", textAlign: "center",
                      minWidth: 72, flexShrink: 0, transition: "all 0.2s",
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{clip.emoji}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 600, lineHeight: 1.2 }}>{clip.title.slice(0, 12)}{clip.title.length > 12 ? "..." : ""}</div>
                    </button>
                  ))}
                  <button onClick={() => setActiveTab("library")} style={{
                    background: "rgba(108,99,255,0.15)", border: "1px dashed rgba(108,99,255,0.4)",
                    borderRadius: 12, padding: "8px 10px", cursor: "pointer", minWidth: 72, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4,
                  }}>
                    <span style={{ fontSize: 16 }}>＋</span>
                    <span style={{ fontSize: 9, color: "rgba(108,99,255,0.8)", fontWeight: 600 }}>More</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "rgba(18,18,26,0.95)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", padding: "10px 0 20px",
        }}>
          {[
            { id: "discover", icon: "🔍", label: "Discover" },
            { id: "library", icon: "📚", label: "Library" },
            { id: "record", icon: "🎙️", label: "Record" },
            { id: "messages", icon: "💬", label: "Messages" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              opacity: activeTab === tab.id ? 1 : 0.4, transition: "opacity 0.2s",
            }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, color: activeTab === tab.id ? "#6C63FF" : "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Send confirm modal */}
      {showSendConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: "0 20px 40px",
        }} onClick={() => setShowSendConfirm(null)}>
          <div style={{
            background: "#1A1A2E", borderRadius: 24, padding: 24, width: "100%", maxWidth: 375,
            border: "1px solid rgba(255,255,255,0.1)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${showSendConfirm.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {showSendConfirm.emoji}
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{showSendConfirm.title}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{showSendConfirm.source} · {showSendConfirm.duration}</div>
              </div>
            </div>
            <button onClick={() => sendClip(showSendConfirm)} style={{
              width: "100%", background: "#6C63FF", border: "none", borderRadius: 14,
              color: "#fff", padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
            }}>
              Send in Messages 💬
            </button>
            <button onClick={() => setShowSendConfirm(null)} style={{
              width: "100%", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 14,
              color: "rgba(255,255,255,0.5)", padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes ping { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 0.2; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function ClipCard({ clip, isPlaying, isSaved, onPlay, onSave, onSend }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "12px 14px",
      border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12,
      transition: "all 0.2s",
    }}>
      {/* Play button */}
      <button onClick={onPlay} style={{
        width: 44, height: 44, borderRadius: 13, flexShrink: 0,
        background: isPlaying ? clip.color : `${clip.color}22`,
        border: `2px solid ${clip.color}55`,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, transition: "all 0.2s", transform: isPlaying ? "scale(1.05)" : "scale(1)",
      }}>
        {isPlaying ? "⏹" : clip.emoji}
      </button>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {clip.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{clip.source}</span>
          <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{clip.plays} plays</span>
          <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{clip.duration}</span>
        </div>
        {isPlaying && (
          <div style={{ marginTop: 6, display: "flex", gap: 2, alignItems: "flex-end", height: 14 }}>
            {[6, 10, 8, 14, 10, 7, 12, 9, 5, 11].map((h, i) => (
              <div key={i} style={{
                width: 3, height: h, background: clip.color, borderRadius: 2,
                animation: `blink ${0.3 + i * 0.08}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={onSave} style={{
          width: 32, height: 32, borderRadius: 10, background: isSaved ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${isSaved ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.08)"}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          transition: "all 0.2s",
        }}>
          {isSaved ? "✓" : "+"}
        </button>
        <button onClick={onSend} style={{
          width: 32, height: 32, borderRadius: 10, background: "rgba(108,99,255,0.15)",
          border: "1px solid rgba(108,99,255,0.3)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          transition: "all 0.2s",
        }}>
          💬
        </button>
      </div>
    </div>
  );
}
