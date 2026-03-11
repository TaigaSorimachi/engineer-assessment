import { useState } from "react";
import { C } from "../lib/constants.js";

export default function SpectrumSlider({ question, value, onChange }) {
  const [hovering, setHovering] = useState(false);
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 40 }}>
        <span style={{ fontFamily: C.fontBody, fontSize: 13, color: value < 40 ? C.gold : "#6a6a6a", flex: 1, textAlign: "left", transition: "color 0.3s", fontWeight: value < 40 ? 600 : 400 }}>{"\u2190"} {question.left}</span>
        <span style={{ fontFamily: C.fontBody, fontSize: 13, color: value > 60 ? C.gold : "#6a6a6a", flex: 1, textAlign: "right", transition: "color 0.3s", fontWeight: value > 60 ? 600 : 400 }}>{question.right} {"\u2192"}</span>
      </div>
      <div style={{ position: "relative", padding: "10px 0" }}>
        <input type="range" min="0" max="100" value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
          onTouchStart={() => setHovering(true)} onTouchEnd={() => setHovering(false)}
          style={{ width: "100%", height: 6, WebkitAppearance: "none", appearance: "none", background: `linear-gradient(90deg, ${C.gold} 0%, ${C.gold} ${value}%, ${C.border} ${value}%, ${C.border} 100%)`, borderRadius: 3, outline: "none", cursor: "pointer" }} />
        <div style={{ position: "absolute", left: `${value}%`, top: -28, transform: "translateX(-50%)", background: C.gold, color: C.bg, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontFamily: C.fontMono, fontWeight: 700, opacity: hovering ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>{value}</div>
      </div>
    </div>
  );
}
