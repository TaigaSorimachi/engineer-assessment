import { useState, useEffect } from "react";
import { C } from "../../lib/constants.js";

export default function InsightCard({ title, text, icon, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontFamily: C.fontBody, fontSize: 15, fontWeight: 700, color: C.gold }}>{title}</span>
      </div>
      <div style={{ fontFamily: C.fontBody, fontSize: 14, lineHeight: 1.9, color: "#b0b0b0", whiteSpace: "pre-wrap" }}>{text}</div>
    </div>
  );
}
