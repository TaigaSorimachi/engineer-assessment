import { C } from "../../lib/constants.js";

export default function TypeBadge({ label, description }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: C.card, border: "1px solid #e8c54744", borderRadius: 12, padding: "16px 24px", minWidth: 100 }}>
      <span style={{ fontFamily: C.fontMono, fontSize: 28, fontWeight: 700, color: C.gold, letterSpacing: 4 }}>{label}</span>
      <span style={{ fontFamily: C.fontBody, fontSize: 11, color: "#6a6a6a", marginTop: 6 }}>{description}</span>
    </div>
  );
}
