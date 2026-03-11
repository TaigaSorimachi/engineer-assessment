/* ═══════════════════════════════════════════════════════
   QUESTIONS — Big Five based, Engineer-contextualized
   IPIP (International Personality Item Pool) を参考に
   エンジニアの業務シーンに特化した質問を設計
   ═══════════════════════════════════════════════════════ */

const QUESTIONS = [
  // ── Section 1: 思考スタイル (4問) ──────────────────
  // Axis: focus_dialogue (Extraversion) — 0=集中, 100=対話
  {
    id: "s1_focus", section: "思考スタイル",
    sectionDesc: "あなたの自然な思考・作業の傾向を探ります",
    type: "spectrum",
    question: "難しい技術課題に直面したとき、最初にどうしますか？",
    left: "一人で静かに考え抜く", right: "誰かと話しながら整理する",
    axis: "focus_dialogue",
  },
  {
    id: "s1_focus_mc", section: "思考スタイル", type: "multi_choice",
    question: "技術的に行き詰まったとき、最初の30分でやりがちなことは？（複数選択可）",
    axis: "focus_dialogue",
    options: [
      { id: "a", label: "エラーメッセージやログをじっくり読む" },
      { id: "b", label: "関連するドキュメントや過去のissueを検索する" },
      { id: "c", label: "同僚やチームメンバーに声をかける" },
      { id: "d", label: "最小限の再現コードを書いて切り分ける" },
      { id: "e", label: "一旦離れて頭を切り替える" },
      { id: "f", label: "ChatGPT等のAIツールに聞く" },
    ],
  },
  // Axis: concrete_abstract (Openness) — 0=具体, 100=抽象
  {
    id: "s1_abstract", section: "思考スタイル", type: "spectrum",
    question: "新しい技術やフレームワークを学ぶとき、どちらから入りますか？",
    left: "チュートリアルで手を動かす", right: "アーキテクチャ図や概念から理解する",
    axis: "concrete_abstract",
  },
  {
    id: "s1_abstract_mc", section: "思考スタイル", type: "multi_choice",
    question: "新しい技術を学ぶとき、最も頼りにする情報源は？（複数選択可）",
    axis: "concrete_abstract",
    options: [
      { id: "a", label: "公式ドキュメント" },
      { id: "b", label: "ハンズオン / チュートリアル" },
      { id: "c", label: "GitHubの実装例やOSSのコード" },
      { id: "d", label: "技術ブログ / Zenn / Qiita等の記事" },
      { id: "e", label: "動画（YouTube / Udemy等）" },
      { id: "f", label: "書籍" },
    ],
  },

  // ── Section 2: 意思決定 (4問) ──────────────────────
  // Axis: conservative_adventurous (Emotional Stability + Openness) — 0=安定, 100=挑戦
  {
    id: "s2_risk", section: "意思決定",
    sectionDesc: "技術的な判断や意思決定のスタイルを探ります",
    type: "spectrum",
    question: "本番環境への変更が必要なとき、あなたの傾向は？",
    left: "十分な検証を重ね慎重に進める", right: "最小限の変更を素早くデプロイする",
    axis: "conservative_adventurous",
  },
  {
    id: "s2_risk_mc", section: "意思決定", type: "single_choice",
    question: "技術選定で最も重視するのは？",
    axis: "conservative_adventurous",
    options: [
      { id: "a", label: "実績と安定性（枯れた技術を選ぶ）" },
      { id: "b", label: "チームの習熟度（学習コストの低さ）" },
      { id: "c", label: "将来性と拡張性（新しくても有望なら採用）" },
      { id: "d", label: "課題への最適性（要件にベストフィットするもの）" },
    ],
  },
  // Axis: planning_exploration (Conscientiousness) — 0=計画, 100=探索
  {
    id: "s2_plan", section: "意思決定", type: "spectrum",
    question: "仕様が曖昧なプロジェクトの進め方は？",
    left: "まず全体設計を固めてから実装", right: "プロトタイプを作りながら設計を発見",
    axis: "planning_exploration",
  },
  {
    id: "s2_plan_mc", section: "意思決定", type: "single_choice",
    question: "「正解がわからない」状態のとき、まず何をする？",
    axis: "planning_exploration",
    options: [
      { id: "a", label: "既存事例や先行研究をリサーチする" },
      { id: "b", label: "最もリスクの高い部分からPoCを作る" },
      { id: "c", label: "ステークホルダーに要件を詳しくヒアリングする" },
      { id: "d", label: "複数案を並べてチームで議論する" },
    ],
  },

  // ── Section 3: 技術的価値観 (5問) ─────────────────
  {
    id: "s3_quality_mc", section: "技術的価値観",
    sectionDesc: "あなたが技術者として大切にしていることの深層に迫ります",
    type: "multi_choice",
    question: "「良いコード」の条件として重視する要素は？（複数選択可）",
    axis: "tech_values",
    options: [
      { id: "a", label: "読みやすさ・意図の明確さ" },
      { id: "b", label: "テストのしやすさ" },
      { id: "c", label: "パフォーマンス・効率性" },
      { id: "d", label: "変更しやすさ・拡張性" },
      { id: "e", label: "シンプルさ・最小限の実装" },
      { id: "f", label: "堅牢性・エラーハンドリング" },
    ],
  },
  {
    id: "s3_debug_mc", section: "技術的価値観", type: "single_choice",
    question: "バグの原因を特定するとき、最も自分らしいアプローチは？",
    axis: "tech_depth",
    options: [
      { id: "a", label: "まず再現手順を確立し、条件を絞り込む" },
      { id: "b", label: "ログやメトリクスを追加して観測する" },
      { id: "c", label: "仮説を立てて、コードリーディングで検証する" },
      { id: "d", label: "二分探索的に変更を切り戻して原因箇所を特定する" },
    ],
  },
  {
    id: "s3_tradeoff_mc", section: "技術的価値観", type: "single_choice",
    question: "納期が迫っている中での技術的トレードオフ。あなたの判断に最も近いのは？",
    axis: "tech_depth",
    options: [
      { id: "a", label: "品質を守る。後で負債を返す方がコストが高い" },
      { id: "b", label: "スコープを削る。機能を減らしてでも品質は保つ" },
      { id: "c", label: "まず出す。動くものを出してからリファクタリングする" },
      { id: "d", label: "相談する。チームやPMと優先順位を再交渉する" },
    ],
  },
  {
    id: "s3_passion", section: "技術的価値観", type: "freetext",
    question: "技術者として、あなたが最もこだわっていること・譲れないことは何ですか？",
    axis: "tech_values",
    placeholder: "技術に対する信念や哲学を自由にお書きください",
    minChars: 30,
  },

  // ── Section 4: 協働と成長 (4問) ───────────────────
  // Axis: collaboration (Agreeableness) — 0=技術重視, 100=共感重視
  {
    id: "s4_collab", section: "��働と成長",
    sectionDesc: "チームでの働き方と成長への姿勢を探ります",
    type: "spectrum",
    question: "コードレビューで意見が対立したとき、あなたの傾向は？",
    left: "技術的正しさを丁寧に説明する", right: "相手の文脈を理解してから議論する",
    axis: "collaboration",
  },
  {
    id: "s4_collab_mc", section: "協働と成長", type: "multi_choice",
    question: "コードレビューで特に意識していることは？（複数選択可）",
    axis: "collaboration",
    options: [
      { id: "a", label: "なぜそう書いたかの意図を理解する" },
      { id: "b", label: "バグや潜在的リスクを見つける" },
      { id: "c", label: "良い点を積極的にコメントする" },
      { id: "d", label: "チームの規約・一貫性を守る" },
      { id: "e", label: "パフォーマンスやセキュリティを確認する" },
    ],
  },
  // Axis: learning — 0=深掘り, 100=幅広
  {
    id: "s4_learn", section: "協働と成長", type: "spectrum",
    question: "新しいスキルの習得について、あなたの傾向は？",
    left: "深く一つの領域を極める", right: "幅広く多くの技術に触れる",
    axis: "learning",
  },
  {
    id: "s4_learn_mc", section: "協働と成長", type: "single_choice",
    question: "直近1年で最も成長を実感した場面に近いのは？",
    axis: "learning",
    options: [
      { id: "a", label: "難しいバグや障害を乗り越えたとき" },
      { id: "b", label: "新しい技術やツールを業務で使えたとき" },
      { id: "c", label: "設計やアーキテクチャを任されたとき" },
      { id: "d", label: "後輩やメンバーに教える・導く場面" },
    ],
  },

  // ── Section 5: シナリオ判断 (3問) ─────────────────
  {
    id: "s5_scenario1", section: "シナリオ判断",
    sectionDesc: "実際の業務シーンに近い状況での判断を見ます",
    type: "single_choice",
    question: "チームで意見が割れている設計判断。あなたはどうする？",
    axis: "scenario_cross",
    options: [
      { id: "a", label: "データや根拠を集めて客観的に比較資料を作る" },
      { id: "b", label: "小さなPoCを2パターン作って実際に比較する" },
      { id: "c", label: "それぞれの案の支持者の意見を丁寧に聞いてまとめる" },
      { id: "d", label: "期限を決めて、最終的にはリーダーが判断すべきと提案する" },
    ],
  },
  {
    id: "s5_scenario2", section: "シナリオ判断", type: "single_choice",
    question: "本番で想定外のパフォーマンス劣化が発覚。まず何をする？",
    axis: "scenario_cross",
    options: [
      { id: "a", label: "まずモニタリングツールでボトルネックを特定する" },
      { id: "b", label: "直近のデプロイをロールバックして影響を止める" },
      { id: "c", label: "チームに状況を共有し、分担して調査する" },
      { id: "d", label: "ユーザー影響の範囲を確認し、ステークホルダーに報告する" },
    ],
  },
  {
    id: "s4_freetext", section: "シナリオ判断", type: "freetext",
    question: "チーム開発で印象に残っているエピソードを一つ教えてください。",
    axis: "collaboration",
    placeholder: "成功でも失敗でも構いません。何が起き、どう関わったかを自由にお書きください",
    minChars: 30,
  },
];

export default QUESTIONS;
