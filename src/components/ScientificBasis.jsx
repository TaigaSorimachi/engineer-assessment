import { C } from "../lib/constants.js";

const AXIS_TABLE = [
  { axis: "Deep Focus ↔ Talk-through", code: "D / T", bigFive: "外向性 (Extraversion)", desc: "思考の深め方：一人で集中 vs 対話で整理" },
  { axis: "Builder ↔ Architect", code: "B / A", bigFive: "開放性 (Openness)", desc: "情報処理：具体から積み上げ vs 抽象から俯瞰" },
  { axis: "Steady ↔ Challenger", code: "S / C", bigFive: "情緒安定性 + 開放性", desc: "リスク姿勢：安定重視 vs 挑戦志向" },
  { axis: "Planner ↔ Explorer", code: "P / X", bigFive: "誠実性 (Conscientiousness)", desc: "作業様式：計画的 vs 探索的" },
];

const cellBase = {
  padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
  fontFamily: C.fontBody, fontSize: 12, lineHeight: 1.6,
};

export default function ScientificBasis() {
  return (
    <div style={{ marginTop: 40, marginBottom: 32 }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 12 }}>
        SCIENTIFIC BASIS
      </div>
      <div style={{ fontFamily: C.fontBody, fontSize: 14, fontWeight: 600, color: "#d0d0d0", marginBottom: 16 }}>
        この分析の根拠
      </div>
      <p style={{ fontFamily: C.fontBody, fontSize: 13, lineHeight: 1.9, color: "#9a9a9a", marginBottom: 20 }}>
        本アセスメントは、心理学で最も科学的再現性が高いとされる<span style={{ color: C.gold }}>ビッグファイブ（OCEAN）パーソナリティモデル</span>をベースに、
        エンジニアの業務シーンに特化した4軸の指標を設計しています。質問設計にはIPIP（International Personality Item Pool）の検証済みアイテムを参考にしています。
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <thead>
            <tr>
              {["軸", "コード", "ビッグファイブ因子", "エンジニア文脈"].map((h) => (
                <th key={h} style={{ ...cellBase, background: "#111", color: C.gold, fontWeight: 600, fontSize: 11, textAlign: "left", fontFamily: C.fontMono }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AXIS_TABLE.map((row, i) => (
              <tr key={i}>
                <td style={{ ...cellBase, color: "#c0c0c0", fontWeight: 500 }}>{row.axis}</td>
                <td style={{ ...cellBase, color: C.gold, fontFamily: C.fontMono }}>{row.code}</td>
                <td style={{ ...cellBase, color: "#a0a0a0" }}>{row.bigFive}</td>
                <td style={{ ...cellBase, color: "#8a8a8a" }}>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontFamily: C.fontBody, fontSize: 11, lineHeight: 1.8, color: "#5a5a5a", marginTop: 16 }}>
        ※ 本ツールはビッグファイブモデルを参考にしたエンジニア特化の独自アセスメントであり、公式な心理学テストではありません。
        結果は能力の優劣を示すものではなく、思考スタイルや傾向の可視化を目的としています。
      </p>
    </div>
  );
}
