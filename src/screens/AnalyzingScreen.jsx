import { C } from "../lib/constants.js";

export default function AnalyzingScreen() {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 48, height: 48, border: `2px solid ${C.border}`, borderTopColor: C.gold, borderRadius: "50%", margin: "0 auto 32px", animation: "spin 1s linear infinite" }} />
      <div style={{ fontFamily: C.fontMono, fontSize: 12, color: C.gold, letterSpacing: 4, marginBottom: 16 }}>ANALYZING</div>
      <p style={{ fontFamily: C.fontBody, fontSize: 15, color: C.textDim, lineHeight: 1.8 }}>回答を分析しています...</p>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
        {[0, 1, 2].map(i => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, animation: `pulse 1.2s ease ${i * 0.3}s infinite` }} />))}
      </div>
    </div>
  );
}
