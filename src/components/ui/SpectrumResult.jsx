import { C } from "../../lib/constants.js";

export default function SpectrumResult({ label, leftLabel, rightLabel, value, color }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: C.fontBody, fontSize: 14, fontWeight: 600, color: "#d0d0d0", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, fontFamily: C.fontBody }}>
        <span style={{ color: value < 40 ? color : C.textDim }}>{leftLabel}</span>
        <span style={{ color: value > 60 ? color : C.textDim }}>{rightLabel}</span>
      </div>
      <div style={{ position: "relative", height: 8, background: C.border, borderRadius: 4 }}>
        <div style={{ position: "absolute", left: `${value}%`, top: "50%", transform: "translate(-50%, -50%)", width: 18, height: 18, borderRadius: "50%", background: color, boxShadow: `0 0 12px ${color}44`, transition: "left 1s cubic-bezier(0.22, 1, 0.36, 1)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: "#2a2a2a" }} />
      </div>
      <div style={{ textAlign: "center", marginTop: 6, fontFamily: C.fontMono, fontSize: 11, color: C.textDark }}>{value}</div>
    </div>
  );
}
