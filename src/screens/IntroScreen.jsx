import { C } from "../lib/constants.js";
import QUESTIONS from "../lib/questions.js";
import TextInput from "../components/ui/TextInput.jsx";

const questionTypes = QUESTIONS.reduce((acc, q) => { acc[q.type] = (acc[q.type] || 0) + 1; return acc; }, {});

export default function IntroScreen({ userName, userEmail, onNameChange, onEmailChange, onStart }) {
  const canStart = userName.trim().length > 0 && userEmail.trim().length > 0 && userEmail.includes("@");

  return (
    <div style={{ maxWidth: 640, textAlign: "center" }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 6, marginBottom: 32, animation: "fadeUp 0.8s ease" }}>ENGINEER ASSESSMENT</div>
      <h1 style={{ fontFamily: C.fontDisplay, fontSize: 48, fontWeight: 600, color: "#f0f0f0", lineHeight: 1.3, marginBottom: 24, animation: "fadeUp 0.8s ease 0.1s both" }}>エンジニア<br/>プロファイリング</h1>
      <p style={{ fontFamily: C.fontBody, fontSize: 15, color: C.textMuted, lineHeight: 2, marginBottom: 12, fontWeight: 300, animation: "fadeUp 0.8s ease 0.2s both" }}>
        このアセスメントは、あなたの技術者としての<span style={{ color: "#b0b0b0" }}>思考スタイル</span>、<span style={{ color: "#b0b0b0" }}>意思決定の傾向</span>、<span style={{ color: "#b0b0b0" }}>技術的価値観</span>を多角的に可視化します。
      </p>
      <p style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textDim, lineHeight: 1.9, marginBottom: 36, animation: "fadeUp 0.8s ease 0.3s both" }}>
        正解・不正解はありません。直感的に、正直にお答えください。<br/>所要時間：約5分（全{QUESTIONS.length}問）
      </p>

      <div style={{ maxWidth: 400, margin: "0 auto 36px", textAlign: "left", animation: "fadeUp 0.8s ease 0.4s both" }}>
        <TextInput label="お名前" value={userName} onChange={onNameChange} placeholder="山田 太郎" />
        <TextInput label="メールアドレス" value={userEmail} onChange={onEmailChange} placeholder="taro@example.com" type="email" mono />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 36, flexWrap: "wrap", animation: "fadeUp 0.8s ease 0.5s both" }}>
        {[
          { label: "スライダー", count: questionTypes.spectrum || 0, color: C.gold, icon: "◁▷" },
          { label: "複数選択", count: questionTypes.multi_choice || 0, color: C.cyan, icon: "☑" },
          { label: "単一選択", count: questionTypes.single_choice || 0, color: C.purple, icon: "○" },
          { label: "自由記述", count: questionTypes.freetext || 0, color: C.green, icon: "✎" },
        ].map((t) => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: C.card, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: C.fontMono, fontSize: 13, color: t.color }}>{t.icon}</span>
            <span style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textMuted }}>{t.label} ×{t.count}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 40, flexWrap: "wrap", animation: "fadeUp 0.8s ease 0.6s both" }}>
        {[
          { n: "01", t: "思考スタイル", d: "集中・対話・抽象・具体" },
          { n: "02", t: "意思決定", d: "リスク姿勢・計画性" },
          { n: "03", t: "技術的価値観", d: "信念・哲学・深層心理" },
          { n: "04", t: "協働と成長", d: "チーム・学習スタイル" },
        ].map((s) => (
          <div key={s.n} style={{ textAlign: "left", padding: "16px 0", minWidth: 120 }}>
            <div style={{ fontFamily: C.fontMono, fontSize: 10, color: C.goldDim, marginBottom: 6 }}>SEC.{s.n}</div>
            <div style={{ fontFamily: C.fontBody, fontSize: 14, color: "#c0c0c0", fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
            <div style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textDark }}>{s.d}</div>
          </div>
        ))}
      </div>

      <div style={{ animation: "fadeUp 0.8s ease 0.7s both" }}>
        <button onClick={onStart} disabled={!canStart}
          style={{ background: canStart ? C.gold : "#1a1a1a", color: canStart ? C.bg : "#3a3a3a", border: "none", padding: "16px 48px", borderRadius: 8, fontFamily: C.fontBody, fontSize: 15, fontWeight: 700, cursor: canStart ? "pointer" : "default", letterSpacing: 2, transition: "all 0.3s" }}
          onMouseEnter={(e) => { if (canStart) { e.target.style.background = C.goldLight; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px #e8c54733"; } }}
          onMouseLeave={(e) => { if (canStart) { e.target.style.background = C.gold; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; } }}>
          アセスメントを開始する
        </button>
        {!canStart && <p style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textDark, marginTop: 12 }}>※ お名前とメールアドレスを入力してください</p>}
      </div>

      <div style={{ marginTop: 40, padding: "16px 24px", background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, animation: "fadeUp 0.8s ease 0.8s both" }}>
        <p style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textDark, lineHeight: 1.8, margin: 0 }}>※ 本アセスメントはビッグファイブ心理学モデルに基づき設計されていますが、連続尺度による傾向の可視化を目的としており、能力の優劣判定や採用の自動合否判定には使用できません。結果は面談の対話材料としてご活用ください。</p>
      </div>
    </div>
  );
}
