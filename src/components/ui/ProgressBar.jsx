import { C } from "../../lib/constants.js";

export default function ProgressBar({ current, total }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div style={{ width: "100%", marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: C.fontMono, fontSize: 12, color: "#8a8a8a", letterSpacing: 1 }}>
        <span>QUESTION {current + 1} / {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div style={{ width: "100%", height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`, borderRadius: 2, transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }} />
      </div>
    </div>
  );
}
