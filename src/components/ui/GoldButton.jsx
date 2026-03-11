import { C } from "../../lib/constants.js";

export default function GoldButton({ onClick, disabled, children, secondary }) {
  const base = secondary
    ? { background: "transparent", border: "1px solid #2a2a2a", color: disabled ? "#2a2a2a" : "#7a7a7a" }
    : { background: disabled ? C.border : C.gold, border: "none", color: disabled ? "#3a3a3a" : C.bg };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, padding: secondary ? "12px 28px" : "12px 36px", borderRadius: 8, fontFamily: C.fontBody, fontSize: 14, fontWeight: secondary ? 400 : 700, cursor: disabled ? "default" : "pointer", transition: "all 0.3s" }}
      onMouseEnter={(e) => { if (!disabled && !secondary) { e.target.style.background = C.goldLight; e.target.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={(e) => { if (!disabled && !secondary) { e.target.style.background = C.gold; e.target.style.transform = "translateY(0)"; } }}>
      {children}
    </button>
  );
}
