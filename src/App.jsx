import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   ENGINEER ASSESSMENT TOOL — Rule-Based Edition
   APIキー不要・完全フロントエンド完結
   ═══════════════════════════════════════════════════════ */

const QUESTIONS = [
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
  {
    id: "s4_collab", section: "協働と成長",
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
  {
    id: "s4_freetext", section: "協働と成長", type: "freetext",
    question: "チーム開発で印象に残っているエピソードを一つ教えてください。",
    axis: "collaboration",
    placeholder: "成功でも失敗でも構いません。何が起き、どう関わったかを自由にお書きください",
    minChars: 30,
  },
];

/* ═══════════════════════════════════════════════════════
   RULE-BASED SCORING ENGINE
   ═══════════════════════════════════════════════════════ */

const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(v)));

function calcMultiChoiceScore(selected, scoreMap) {
  if (!selected || selected.length === 0) return 50;
  const scores = selected.map((id) => scoreMap[id] ?? 50);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateScores(answers) {
  // ── Axis 1: focus_dialogue (0=集中, 100=対話) ──
  const fd_spectrum = answers.s1_focus ?? 50;
  const fd_mc = calcMultiChoiceScore(answers.s1_focus_mc, {
    a: 20, b: 30, c: 85, d: 25, e: 50, f: 40,
  });
  const focus_dialogue = clamp(fd_spectrum * 0.6 + fd_mc * 0.4);

  // ── Axis 2: concrete_abstract (0=具体, 100=抽象) ──
  const ca_spectrum = answers.s1_abstract ?? 50;
  const ca_mc = calcMultiChoiceScore(answers.s1_abstract_mc, {
    a: 70, b: 20, c: 30, d: 45, e: 25, f: 75,
  });
  const concrete_abstract = clamp(ca_spectrum * 0.6 + ca_mc * 0.4);

  // ── Axis 3: conservative_adventurous (0=安定, 100=挑戦) ──
  const risk_spectrum = answers.s2_risk ?? 50;
  const risk_mc = { a: 15, b: 30, c: 80, d: 60 }[answers.s2_risk_mc] ?? 50;
  const conservative_adventurous = clamp(risk_spectrum * 0.55 + risk_mc * 0.45);

  // ── Axis 4: planning_exploration (0=計画, 100=探索) ──
  const plan_spectrum = answers.s2_plan ?? 50;
  const plan_mc = { a: 25, b: 85, c: 20, d: 55 }[answers.s2_plan_mc] ?? 50;
  const planning_exploration = clamp(plan_spectrum * 0.55 + plan_mc * 0.45);

  // ── Collaboration (0=技術重視, 100=共感重視) ──
  const collab_spectrum = answers.s4_collab ?? 50;
  const collab_mc = calcMultiChoiceScore(answers.s4_collab_mc, {
    a: 75, b: 35, c: 85, d: 40, e: 30,
  });
  const collaboration = clamp(collab_spectrum * 0.5 + collab_mc * 0.5);

  // ── Learning (0=深掘り, 100=幅広) ──
  const learn_spectrum = answers.s4_learn ?? 50;
  const learn_mc = { a: 25, b: 65, c: 35, d: 55 }[answers.s4_learn_mc] ?? 50;
  const learning = clamp(learn_spectrum * 0.6 + learn_mc * 0.4);

  return {
    focus_dialogue,
    concrete_abstract,
    conservative_adventurous,
    planning_exploration,
    collaboration,
    learning,
  };
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE-BASED INSIGHT GENERATOR
   ═══════════════════════════════════════════════════════ */

function band(score) {
  if (score < 35) return "low";
  if (score < 65) return "mid";
  return "high";
}

function generateTypeCode(scores) {
  const c1 = scores.focus_dialogue < 50 ? "D" : "T";
  const c2 = scores.concrete_abstract < 50 ? "C" : "A";
  const c3 = scores.conservative_adventurous < 50 ? "S" : "H";
  const c4 = scores.planning_exploration < 50 ? "P" : "X";
  return c1 + c2 + c3 + c4;
}

const TYPE_NAMES = {
  DCSP: "堅実な職人型", DCSX: "実験的クラフター",
  DCHP: "戦略的アーキテクト", DCHX: "探究するイノベーター",
  DASP: "理論派プランナー", DASX: "柔軟な理論家",
  DAHP: "ビジョナリー設計者", DAHX: "先駆的リサーチャー",
  TCSP: "チーム志向の実務家", TCSX: "アジャイルプレイヤー",
  TCHP: "推進力のあるリーダー", TCHX: "共創型イノベーター",
  TASP: "対話で深める思考家", TASX: "越境するファシリテーター",
  TAHP: "構想力のある導き手", TAHX: "変革を楽しむ開拓者",
};

const AXIS_INSIGHTS = {
  focus_dialogue: {
    low: "一人で深く思考に沈む集中型です。静かな環境で最もパフォーマンスを発揮し、問題を自分の頭の中で構造化してから解決に向かう傾向があります。ペアプログラミングよりも、考えをまとめてからレビューで議論するスタイルが合っているかもしれません。",
    mid: "状況に応じて集中と対話を使い分ける柔軟なスタイルです。難問に直面した際、まず自分で整理しつつも、行き詰まったら周囲の視点を取り入れることができます。このバランス感覚はチーム開発において大きな強みとなります。",
    high: "対話を通じて思考を整理する対話型です。アイデアを言語化し、他者のリアクションから新たな視点を得ることで問題解決に向かいます。ブレインストーミングやモブプログラミングのような協働的手法で力を発揮するタイプです。",
  },
  concrete_abstract: {
    low: "手を動かしながら学ぶ具体型です。チュートリアルや実装例から入り、動くコードを通じて概念を体得していきます。抽象的な議論よりも「まず動くものを見せて」というアプローチが自然で、プロトタイピングの速さが強みです。",
    mid: "具体と抽象を行き来できるバランス型です。概念を理解した上で手を動かし、実装を通じて理解を深めるサイクルを自然に回せます。設計議論と実装の両方で貢献できるマルチな強みがあります。",
    high: "アーキテクチャや概念モデルから入る抽象型です。全体像を把握してから部分に取り組む思考パターンで、設計ドキュメントや技術書を好みます。システム全体の整合性を俯瞰する力があり、設計フェーズで大きな価値を発揮します。",
  },
  conservative_adventurous: {
    low: "安定性と実績を重視する慎重派です。本番環境への変更には十分な検証を求め、枯れた技術を信頼します。この姿勢はミッションクリティカルなシステムにおいて極めて重要であり、チームの品質の砦となる存在です。",
    mid: "リスクとリターンを冷静に天秤にかける現実派です。状況に応じて慎重にも大胆にもなれる判断力があります。新技術の採用には実績と課題適合性の両面から評価する、バランスの取れたアプローチをとります。",
    high: "新しい技術や手法に積極的に挑戦する開拓型です。将来性を見据えた技術選定を好み、不確実性を成長の機会と捉えます。チームに新しい風を吹き込み、技術的な停滞を防ぐ推進力があります。",
  },
  planning_exploration: {
    low: "設計を固めてから実装に進む計画型です。全体設計やリサーチを先行させ、見通しを立ててから着手します。大規模プロジェクトや複雑な要件での失敗リスクを最小化する力があり、プロジェクトの安定に貢献します。",
    mid: "計画と探索をバランスよく組み合わせるプラグマティストです。ある程度の設計を行いつつ、不確実な部分はプロトタイプで検証するアプローチをとります。チームの進め方に柔軟に適応できる強みがあります。",
    high: "プロトタイプを作りながら最適解を発見する探索型です。手を動かしながら設計を洗練させていく反復的アプローチを好みます。仕様が曖昧な段階でも前に進める推進力があり、アジャイル開発との親和性が高いスタイルです。",
  },
};

const QUALITY_PROFILES = {
  readable: "コードの可読性と意図の明確さを大切にしています。チームで長期的に保守されるコードにとって、読みやすさは最も重要な品質の一つです。",
  testable: "テスタビリティを重視する姿勢は、品質に対する高い意識の表れです。テストしやすい設計は、結果として保守性や信頼性の高いコードにつながります。",
  performant: "パフォーマンスへの意識が高く、効率的な実装を追求します。ユーザー体験やシステムの応答性に対する責任感が見られます。",
  extensible: "変更容易性と拡張性を重視しています。ソフトウェアが長期的に進化し続けることを前提とした、先を見据えた設計思想です。",
  simple: "シンプルさ・最小限の実装を志向しています。YAGNIやKISSの原則に共感し、過度な抽象化よりも明快な解を好む傾向があります。",
  robust: "堅牢性とエラーハンドリングを重視しています。想定外の状況にも耐えるシステムを作りたいという、信頼性への強いこだわりが感じられます。",
};

const DEBUG_PROFILES = {
  a: "再現手順の確立から始める体系的なアプローチ。問題を安定的に再現させることで、仮説検証の精度を上げる手堅い手法です。",
  b: "可観測性を重視し、ログやメトリクスから事実ベースで追跡するアプローチ。データドリブンなデバッグは、複雑なシステムの問題解決に特に効果的です。",
  c: "コードリーディングと仮説検証を組み合わせた分析型アプローチ。システムの内部構造への深い理解に基づく問題解決力が窺えます。",
  d: "二分探索的に原因を絞り込む効率的なアプローチ。問題の切り分けが素早く、複雑な原因でも系統的にたどり着ける強みがあります。",
};

const TRADEOFF_PROFILES = {
  a: "品質を最優先し、技術的負債の蓄積を許容しない姿勢です。長期的なコスト意識が高く、「急がば回れ」の哲学を持っています。品質の門番としてチームに貢献できます。",
  b: "スコープ調整で品質を守る交渉型です。「全部作る」より「良いものを少なく」という判断ができる、プロダクト思考の持ち主です。PMとの建設的な対話が得意かもしれません。",
  c: "まず動くものを出すスピード重視型です。フィードバックループを素早く回すことの価値を理解しており、リファクタリング前提で前に進める判断力があります。スタートアップ的な環境で特に力を発揮します。",
  d: "チームやステークホルダーとの対話で最適解を探る協調型です。一人で抱え込まず、優先順位の再交渉ができるコミュニケーション力が見られます。マネジメント視点も持ち合わせています。",
};

function generateQualityPhilosophy(selected) {
  if (!selected || selected.length === 0) return "コード品質に対する回答が未選択です。";
  const map = { a: "readable", b: "testable", c: "performant", d: "extensible", e: "simple", f: "robust" };
  const profiles = selected.map((id) => QUALITY_PROFILES[map[id]]).filter(Boolean);
  if (profiles.length === 1) return profiles[0];
  if (profiles.length <= 3) return profiles.join("\n\nまた、") + "\n\n複数の品質軸を意識できることは、成熟した技術者の特徴です。";
  return profiles.slice(0, 3).join("\n\n") + "\n\n幅広い品質観点を持ち合わせており、状況に応じて重視する軸を切り替えられる柔軟性があります。";
}

function generateCollabInsight(score, selected) {
  const b = band(score);
  const base = {
    low: "技術的な正しさを重視し、論理的な根拠に基づいてレビューを行うスタイルです。コードの品質向上に対する高い基準を持っており、チームの技術水準の底上げに貢献します。",
    mid: "技術的な正確さと相手への配慮をバランスよく両立するスタイルです。指摘する際も相手の意図を汲み取り、建設的な対話を心がける姿勢が見られます。",
    high: "相手の文脈や意図を理解することを優先する共感型のスタイルです。心理的安全性を大切にし、チームメンバーが安心してコードを出せる環境づくりに貢献します。",
  }[b];

  const strengths = [];
  if (selected?.includes("a")) strengths.push("意図の理解を重視する傾向");
  if (selected?.includes("c")) strengths.push("ポジティブフィードバックの習慣");
  if (selected?.includes("b")) strengths.push("リスク検知への高い意識");
  if (selected?.includes("d")) strengths.push("規約と一貫性の遵守");
  if (selected?.includes("e")) strengths.push("非機能要件への目配り");

  const strengthText = strengths.length > 0
    ? "\n\nレビューでは特に「" + strengths.join("」「") + "」が強みとして発揮されます。"
    : "";

  return base + strengthText;
}

function generateLearningInsight(score, learnMc) {
  const b = band(score);
  const base = {
    low: "一つの領域を深く掘り下げるスペシャリスト志向です。専門性の深さが強みであり、その領域における第一人者となるポテンシャルを持っています。",
    mid: "深さと広さをバランスよく追求するT型人材の傾向があります。軸となる専門領域を持ちつつ、隣接技術にも関心を広げるスタイルは、多くのチームで重宝される存在です。",
    high: "幅広い技術に好奇心を持つジェネラリスト志向です。多様な技術スタックを横断できる力は、チーム間の橋渡しや新技術の導入提案において大きな価値を発揮します。",
  }[b];

  const growthMap = {
    a: "困難な問題の克服から成長を実感するタイプです。プレッシャーのかかる場面で力を発揮し、そこから得た経験を糧にする強さがあります。",
    b: "新しい技術の習得と実践から成長を感じるタイプです。技術トレンドへの感度が高く、学んだことを素早く業務に還元する力があります。",
    c: "設計やアーキテクチャの意思決定から成長を実感するタイプです。技術の上流工程にやりがいを見出しており、テックリードやアーキテクトとしての成長パスが見えます。",
    d: "人に教え、導くことから成長を感じるタイプです。自分の知識を整理して伝える過程で理解を深め、チーム全体の底上げに貢献する姿勢があります。",
  };

  const growthText = growthMap[learnMc] || "";
  return base + (growthText ? "\n\n" + growthText : "");
}

function generateCoreBelief(answers) {
  const quality = answers.s3_quality_mc || [];
  const tradeoff = answers.s3_tradeoff_mc;
  if (quality.includes("a") && quality.includes("e")) return "明快で読みやすいコードこそが最良のコード";
  if (quality.includes("d") && quality.includes("b")) return "変化に強く、テストで守られたシステムを作る";
  if (quality.includes("c") && quality.includes("f")) return "パフォーマンスと堅牢性の両立を追求する";
  if (quality.includes("a") && quality.includes("d")) return "意図が伝わり、長期的に進化できるコードを目指す";
  if (tradeoff === "a") return "品質への妥協なき姿勢がプロフェッショナルの証";
  if (tradeoff === "c") return "まず動くものを世に出し、そこから磨き上げる";
  if (tradeoff === "b") return "本当に大切なものに絞り、その品質を極限まで高める";
  if (tradeoff === "d") return "チームで最適解を見つけるプロセスを大切にする";
  if (quality.length >= 4) return "多角的な品質観点でソフトウェアの価値を最大化する";
  return "技術を通じてより良いものを作り続ける";
}

function generateSummary(scores, typeCode, typeName, answers) {
  const fd = band(scores.focus_dialogue);
  const ca = band(scores.concrete_abstract);
  const risk = band(scores.conservative_adventurous);
  const plan = band(scores.planning_exploration);

  const thinkStyle = { low: "一人で深く集中して考える", mid: "集中と対話を柔軟に使い分ける", high: "対話を通じて思考を深める" }[fd];
  const infoStyle = { low: "具体的な事実と実装から積み上げる", mid: "具体と抽象を自然に行き来する", high: "概念やモデルで全体を俯瞰する" }[ca];
  const riskStyle = { low: "安定性と実績を重視した慎重な", mid: "状況に応じてバランスの取れた", high: "新しい可能性に果敢に挑む" }[risk];
  const planStyle = { low: "計画を立ててから着実に進める", mid: "計画と探索を柔軟に組み合わせる", high: "試行錯誤しながら最適解を発見する" }[plan];

  return `${typeName}（${typeCode}）タイプ。${thinkStyle}スタイルで、${infoStyle}思考の持ち主です。意思決定においては${riskStyle}判断を下し、${planStyle}アプローチを得意とします。技術的価値観と問題解決パターンに明確な軸を持った技術者です。`;
}

function generateInterviewSuggestions(scores, answers) {
  const suggestions = [];

  // 自由記述の有無で分岐
  if (answers.s3_passion && answers.s3_passion.trim().length > 0) {
    suggestions.push("自由記述で述べた「こだわり」について、実際のプロジェクトでどう体現したか具体的エピソードを聞いてみてください。");
  }
  if (answers.s4_freetext && answers.s4_freetext.trim().length > 0) {
    suggestions.push("チーム開発エピソードについて、そこから得た学びや、今の自分にどう活きているかを深掘りしてください。");
  }

  // スコアに基づく提案
  if (scores.focus_dialogue < 30) {
    suggestions.push("集中型の傾向が強いため、チーム内でのコミュニケーション頻度やペアプロへの適応について確認すると良いでしょう。");
  } else if (scores.focus_dialogue > 70) {
    suggestions.push("対話型の傾向が強いため、一人で集中して取り組む場面での進め方や、リモート環境での適応について聞いてみてください。");
  }

  if (scores.conservative_adventurous > 70) {
    suggestions.push("挑戦志向が高いため、過去に技術選定で失敗した経験とそこからの学びについて聞くと、リスク判断の成熟度が分かります。");
  } else if (scores.conservative_adventurous < 30) {
    suggestions.push("慎重な傾向があるため、スピードが求められた場面でどう対応したか、技術的負債とスピードのトレードオフ経験を聞いてみてください。");
  }

  if (scores.collaboration < 35) {
    suggestions.push("技術的正しさを重視する傾向があるため、意見が対立した際の具体的な解決プロセスについて確認すると良いでしょう。");
  }

  if (scores.planning_exploration > 70) {
    suggestions.push("探索型の傾向が強いため、長期プロジェクトでの計画性やドキュメンテーションの習慣について確認してみてください。");
  }

  // 最低3つ確保
  const defaults = [
    "チームで技術的な意思決定を行った経験と、その際の自分の役割について詳しく聞いてみてください。",
    "直近で最も成長を感じた技術領域と、今後伸ばしたいスキルについて聞くと、成長意欲と方向性が見えます。",
    "理想のチームや開発文化についてのビジョンを聞くと、カルチャーフィットの判断材料になります。",
  ];

  while (suggestions.length < 3) {
    const next = defaults.find((d) => !suggestions.includes(d));
    if (next) suggestions.push(next);
    else break;
  }

  return suggestions.slice(0, 5);
}

function generateFullResult(answers) {
  const scores = calculateScores(answers);
  const typeCode = generateTypeCode(scores);
  const typeName = TYPE_NAMES[typeCode] || "バランス型エンジニア";

  return {
    style_profile: {
      focus_dialogue: {
        score: scores.focus_dialogue,
        insight: AXIS_INSIGHTS.focus_dialogue[band(scores.focus_dialogue)],
      },
      concrete_abstract: {
        score: scores.concrete_abstract,
        insight: AXIS_INSIGHTS.concrete_abstract[band(scores.concrete_abstract)],
      },
      conservative_adventurous: {
        score: scores.conservative_adventurous,
        insight: AXIS_INSIGHTS.conservative_adventurous[band(scores.conservative_adventurous)],
      },
      planning_exploration: {
        score: scores.planning_exploration,
        insight: AXIS_INSIGHTS.planning_exploration[band(scores.planning_exploration)],
      },
    },
    type_code: typeCode,
    type_name: typeName,
    tech_values: {
      core_belief: generateCoreBelief(answers),
      quality_philosophy: generateQualityPhilosophy(answers.s3_quality_mc),
      problem_solving_pattern: DEBUG_PROFILES[answers.s3_debug_mc] || "問題解決アプローチに対する回答が未選択です。",
      tradeoff_tendency: TRADEOFF_PROFILES[answers.s3_tradeoff_mc] || "トレードオフ判断に対する回答が未選択です。",
    },
    collaboration: {
      score: scores.collaboration,
      style: generateCollabInsight(scores.collaboration, answers.s4_collab_mc),
      strength: band(scores.collaboration) === "high" ? "心理的安全性の構築とチームの一体感づくり" : band(scores.collaboration) === "low" ? "技術的品質の番人としてのレビュー力" : "技術力と共感力のバランスによるブリッジ役",
    },
    learning: {
      score: scores.learning,
      pattern: generateLearningInsight(scores.learning, answers.s4_learn_mc),
      depth_vs_breadth: band(scores.learning) === "high" ? "幅広い技術への好奇心が旺盛で、チーム内の技術的な橋渡し役として活躍できるポテンシャルがあります。" : band(scores.learning) === "low" ? "深い専門性を武器にしており、特定領域のエキスパートとしてチームに安定感をもたらします。" : "深さと広さのバランスが取れたT型エンジニアとして、幅広い貢献が期待できます。",
    },
    interview_suggestions: generateInterviewSuggestions(scores, answers),
    summary: generateSummary(scores, typeCode, typeName, answers),
    // 自由記述は面談の参考用にそのまま保持
    freetext_responses: {
      tech_passion: answers.s3_passion || "",
      team_episode: answers.s4_freetext || "",
    },
  };
}

/* ─── GAS Webhook ─── */
const GAS_WEBHOOK_URL = import.meta.env.VITE_GAS_URL || "";

async function sendToSheet(result, answers, userName, userEmail) {
  if (!GAS_WEBHOOK_URL) return;
  try {
    await fetch(GAS_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({
        ...result,
        timestamp: new Date().toISOString(),
        answers,
        candidate_name: userName,
        candidate_email: userEmail,
      }),
    });
  } catch (e) {
    console.warn("Sheet save failed:", e);
  }
}

/* ─── Color & Font Tokens ─── */
const C = {
  bg: "#0a0a0a", card: "#0f0f0f", border: "#1a1a1a",
  gold: "#e8c547", goldLight: "#f0d968", goldDim: "#e8c54788",
  text: "#e0e0e0", textMuted: "#7a7a7a", textDim: "#5a5a5a", textDark: "#4a4a4a",
  cyan: "#47c5e8", purple: "#c547e8", green: "#47e8a0",
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Noto Sans JP', sans-serif",
  fontMono: "'DM Mono', monospace",
};

/* ─── UI Sub Components ─── */

function ProgressBar({ current, total }) {
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

function SpectrumSlider({ question, value, onChange }) {
  const [hovering, setHovering] = useState(false);
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 40 }}>
        <span style={{ fontFamily: C.fontBody, fontSize: 13, color: value < 40 ? C.gold : "#6a6a6a", flex: 1, textAlign: "left", transition: "color 0.3s", fontWeight: value < 40 ? 600 : 400 }}>← {question.left}</span>
        <span style={{ fontFamily: C.fontBody, fontSize: 13, color: value > 60 ? C.gold : "#6a6a6a", flex: 1, textAlign: "right", transition: "color 0.3s", fontWeight: value > 60 ? 600 : 400 }}>{question.right} →</span>
      </div>
      <div style={{ position: "relative", padding: "10px 0" }}>
        <input type="range" min="0" max="100" value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
          style={{ width: "100%", height: 6, WebkitAppearance: "none", appearance: "none", background: `linear-gradient(90deg, ${C.gold} 0%, ${C.gold} ${value}%, ${C.border} ${value}%, ${C.border} 100%)`, borderRadius: 3, outline: "none", cursor: "pointer" }} />
        <div style={{ position: "absolute", left: `${value}%`, top: -28, transform: "translateX(-50%)", background: C.gold, color: C.bg, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontFamily: C.fontMono, fontWeight: 700, opacity: hovering ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>{value}</div>
      </div>
    </div>
  );
}

function ChoiceButton({ active, onClick, children, radio }) {
  return (
    <button onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 14, background: active ? "#e8c54712" : C.card, border: `1px solid ${active ? "#e8c54766" : "#1e1e1e"}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all 0.25s", textAlign: "left", width: "100%" }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "#333"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = active ? "#e8c54766" : "#1e1e1e"; }}>
      <div style={{ width: 22, height: 22, borderRadius: radio ? "50%" : 6, border: `2px solid ${active ? C.gold : "#333"}`, background: active ? C.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s" }}>
        {active && (radio
          ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.bg }} />
          : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9L10 3" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      <span style={{ fontFamily: C.fontBody, fontSize: 14, color: active ? C.text : "#9a9a9a", transition: "color 0.25s" }}>{children}</span>
    </button>
  );
}

function MultiChoiceInput({ question, value, onChange }) {
  const selected = value || [];
  const toggle = (id) => selected.includes(id) ? onChange(selected.filter((x) => x !== id)) : onChange([...selected, id]);
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options.map((opt) => (
        <ChoiceButton key={opt.id} active={selected.includes(opt.id)} onClick={() => toggle(opt.id)}>{opt.label}</ChoiceButton>
      ))}
    </div>
  );
}

function SingleChoiceInput({ question, value, onChange }) {
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options.map((opt) => (
        <ChoiceButton key={opt.id} active={value === opt.id} onClick={() => onChange(opt.id)} radio>{opt.label}</ChoiceButton>
      ))}
    </div>
  );
}

function FreetextInput({ question, value, onChange }) {
  const ref = useRef(null);
  const minChars = question.minChars || 30;
  const len = (value || "").length;
  const met = len >= minChars;
  useEffect(() => { if (ref.current) { ref.current.style.height = "auto"; ref.current.style.height = ref.current.scrollHeight + "px"; } }, [value]);
  return (
    <div style={{ marginTop: 24 }}>
      <textarea ref={ref} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={question.placeholder} rows={4}
        style={{ width: "100%", background: C.card, border: `1px solid ${met ? "#2a3a2a" : "#2a2a2a"}`, borderRadius: 8, color: C.text, fontFamily: C.fontBody, fontSize: 15, lineHeight: 1.8, padding: "16px 20px", resize: "none", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" }}
        onFocus={(e) => (e.target.style.borderColor = C.gold)}
        onBlur={(e) => (e.target.style.borderColor = met ? "#2a3a2a" : "#2a2a2a")} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontFamily: C.fontMono, fontSize: 12 }}>
        <span style={{ color: met ? "#5a8a4a" : C.gold, display: "flex", alignItems: "center", gap: 6 }}>
          {met ? <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#5a8a4a" strokeWidth="1.5"/><path d="M4 7.2L6 9.2L10 5" stroke="#5a8a4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>OK</span></> : <>最低 {minChars} 文字（あと {Math.max(0, minChars - len)} 文字）</>}
        </span>
        <span style={{ color: C.textDark }}>{len} 文字</span>
      </div>
    </div>
  );
}

function SectionHeader({ section, desc }) {
  return (
    <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{section}</div>
      {desc && <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textDim }}>{desc}</div>}
    </div>
  );
}

function SpectrumResult({ label, leftLabel, rightLabel, value, color }) {
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

function InsightCard({ title, text, icon, delay }) {
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

function TypeBadge({ label, description }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: C.card, border: "1px solid #e8c54744", borderRadius: 12, padding: "16px 24px", minWidth: 100 }}>
      <span style={{ fontFamily: C.fontMono, fontSize: 28, fontWeight: 700, color: C.gold, letterSpacing: 4 }}>{label}</span>
      <span style={{ fontFamily: C.fontBody, fontSize: 11, color: "#6a6a6a", marginTop: 6 }}>{description}</span>
    </div>
  );
}

function GoldButton({ onClick, disabled, children, secondary }) {
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

function TextInput({ label, value, onChange, placeholder, type = "text", mono }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontFamily: C.fontMono, fontSize: 11, color: C.goldDim, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: C.card, border: "1px solid #2a2a2a", borderRadius: 8, color: C.text, fontFamily: mono ? C.fontMono : C.fontBody, fontSize: 15, padding: "14px 18px", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" }}
        onFocus={(e) => (e.target.style.borderColor = C.gold)}
        onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function EngineerAssessment() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [animIn, setAnimIn] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [sheetSaved, setSheetSaved] = useState(false);

  const transitionTo = (fn) => { setAnimIn(false); setTimeout(() => { fn(); setAnimIn(true); }, 300); };
  const handleAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const goNext = () => { if (currentQ < QUESTIONS.length - 1) transitionTo(() => setCurrentQ((c) => c + 1)); else runAnalysis(); };
  const goPrev = () => { if (currentQ > 0) transitionTo(() => setCurrentQ((c) => c - 1)); };

  const canProceed = () => {
    const q = QUESTIONS[currentQ]; const val = answers[q.id];
    if (q.type === "spectrum") return val !== undefined;
    if (q.type === "freetext") return val && val.trim().length >= (q.minChars || 30);
    if (q.type === "multi_choice") return val && val.length > 0;
    if (q.type === "single_choice") return !!val;
    return false;
  };

  const canStart = () => userName.trim().length > 0 && userEmail.trim().length > 0 && userEmail.includes("@");

  const runAnalysis = () => {
    setPhase("analyzing");
    // 演出のため少し遅延（ルールベースなので実際は即時）
    setTimeout(() => {
      const res = generateFullResult(answers);
      setResult(res);
      setPhase("results");
      sendToSheet(res, answers, userName, userEmail).then(() => setSheetSaved(true));
    }, 1800);
  };

  const questionTypes = QUESTIONS.reduce((acc, q) => { acc[q.type] = (acc[q.type] || 0) + 1; return acc; }, {});
  const containerStyle = { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };

  const cssBlock = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes pulse { 0%,100% { opacity:.4 } 50% { opacity:1 } }
    * { margin:0; padding:0; box-sizing:border-box; }
    input[type=range] { -webkit-appearance:none; appearance:none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:#e8c547; cursor:pointer; box-shadow:0 0 12px #e8c54744; }
    ::selection { background: #e8c54733; color: #f0f0f0; }
  `;

  /* ═══ INTRO ═══ */
  if (phase === "intro") {
    return (
      <div style={containerStyle}><style>{cssBlock}</style>
        <div style={{ maxWidth: 640, textAlign: "center" }}>
          <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 6, marginBottom: 32, animation: "fadeUp 0.8s ease" }}>ENGINEER ASSESSMENT</div>
          <h1 style={{ fontFamily: C.fontDisplay, fontSize: 48, fontWeight: 600, color: "#f0f0f0", lineHeight: 1.3, marginBottom: 24, animation: "fadeUp 0.8s ease 0.1s both" }}>エンジニア<br/>プロファイリング</h1>
          <p style={{ fontFamily: C.fontBody, fontSize: 15, color: C.textMuted, lineHeight: 2, marginBottom: 12, fontWeight: 300, animation: "fadeUp 0.8s ease 0.2s both" }}>
            このアセスメントは、あなたの技術者としての<span style={{ color: "#b0b0b0" }}>思考スタイル</span>、<span style={{ color: "#b0b0b0" }}>意思決定の傾向</span>、<span style={{ color: "#b0b0b0" }}>技術的価値観</span>を多角的に可視化します。
          </p>
          <p style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textDim, lineHeight: 1.9, marginBottom: 36, animation: "fadeUp 0.8s ease 0.3s both" }}>
            正解・不正解はありません。直感的に、正直にお答えください。<br/>所要時間：約5〜8分（全{QUESTIONS.length}問）
          </p>

          <div style={{ maxWidth: 400, margin: "0 auto 36px", textAlign: "left", animation: "fadeUp 0.8s ease 0.4s both" }}>
            <TextInput label="お名前" value={userName} onChange={setUserName} placeholder="山田 太郎" />
            <TextInput label="メールアドレス" value={userEmail} onChange={setUserEmail} placeholder="taro@example.com" type="email" mono />
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
            <button onClick={() => setPhase("questions")} disabled={!canStart()}
              style={{ background: canStart() ? C.gold : "#1a1a1a", color: canStart() ? C.bg : "#3a3a3a", border: "none", padding: "16px 48px", borderRadius: 8, fontFamily: C.fontBody, fontSize: 15, fontWeight: 700, cursor: canStart() ? "pointer" : "default", letterSpacing: 2, transition: "all 0.3s" }}
              onMouseEnter={(e) => { if (canStart()) { e.target.style.background = C.goldLight; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px #e8c54733"; } }}
              onMouseLeave={(e) => { if (canStart()) { e.target.style.background = C.gold; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; } }}>
              アセスメントを開始する
            </button>
            {!canStart() && <p style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textDark, marginTop: 12 }}>※ お名前とメールアドレスを入力してください</p>}
          </div>

          <div style={{ marginTop: 40, padding: "16px 24px", background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, animation: "fadeUp 0.8s ease 0.8s both" }}>
            <p style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textDark, lineHeight: 1.8, margin: 0 }}>※ 本アセスメントは心理測定学の研究知見に基づき設計されていますが、連続尺度による傾向の可視化を目的としており、能力の優劣判定や採用の自動合否判定には使用できません。結果は面談の対話材料としてご活用ください。</p>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ QUESTIONS ═══ */
  if (phase === "questions") {
    const q = QUESTIONS[currentQ];
    const tm = { spectrum: { icon: "◁▷", label: "スライダーで選択" }, multi_choice: { icon: "☑", label: "複数選択可" }, single_choice: { icon: "○", label: "ひとつ選択" }, freetext: { icon: "✎", label: "自由記述" } }[q.type] || {};
    return (
      <div style={containerStyle}><style>{cssBlock}</style>
        <div style={{ maxWidth: 640, width: "100%" }}>
          <ProgressBar current={currentQ} total={QUESTIONS.length} />
          <div style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateX(0)" : "translateX(30px)", transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}>
            <SectionHeader section={q.section} desc={q.sectionDesc} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10, marginTop: 12, padding: "4px 12px", background: "#e8c54710", borderRadius: 6 }}>
              <span style={{ fontFamily: C.fontMono, fontSize: 12, color: "#e8c54799" }}>{tm.icon}</span>
              <span style={{ fontFamily: C.fontMono, fontSize: 11, color: "#e8c54799" }}>{tm.label}</span>
            </div>
            <h2 style={{ fontFamily: C.fontBody, fontSize: 20, fontWeight: 600, color: C.text, lineHeight: 1.7, marginTop: 8, marginBottom: 8 }}>{q.question}</h2>
            {q.type === "spectrum" && <SpectrumSlider question={q} value={answers[q.id] ?? 50} onChange={(v) => handleAnswer(q.id, v)} />}
            {q.type === "multi_choice" && <MultiChoiceInput question={q} value={answers[q.id]} onChange={(v) => handleAnswer(q.id, v)} />}
            {q.type === "single_choice" && <SingleChoiceInput question={q} value={answers[q.id]} onChange={(v) => handleAnswer(q.id, v)} />}
            {q.type === "freetext" && <FreetextInput question={q} value={answers[q.id]} onChange={(v) => handleAnswer(q.id, v)} />}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, gap: 16 }}>
            <GoldButton onClick={goPrev} disabled={currentQ === 0} secondary>戻る</GoldButton>
            <GoldButton onClick={goNext} disabled={!canProceed()}>{currentQ === QUESTIONS.length - 1 ? "分析する" : "次へ"}</GoldButton>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ ANALYZING (演出) ═══ */
  if (phase === "analyzing") {
    return (
      <div style={containerStyle}><style>{cssBlock}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: `2px solid ${C.border}`, borderTopColor: C.gold, borderRadius: "50%", margin: "0 auto 32px", animation: "spin 1s linear infinite" }} />
          <div style={{ fontFamily: C.fontMono, fontSize: 12, color: C.gold, letterSpacing: 4, marginBottom: 16 }}>ANALYZING</div>
          <p style={{ fontFamily: C.fontBody, fontSize: 15, color: C.textDim, lineHeight: 1.8 }}>回答を分析しています...</p>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
            {[0, 1, 2].map(i => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, animation: `pulse 1.2s ease ${i * 0.3}s infinite` }} />))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══ RESULTS ═══ */
  if (phase === "results" && result) {
    const sp = result.style_profile || {};
    const colors = [C.gold, C.cyan, C.purple, C.green];
    return (
      <div style={{ minHeight: "100vh", background: C.bg, padding: "40px 20px" }}><style>{cssBlock}</style>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.8s ease" }}>
            <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 6, marginBottom: 20 }}>ASSESSMENT RESULT</div>
            <h1 style={{ fontFamily: C.fontDisplay, fontSize: 40, fontWeight: 600, color: "#f0f0f0", marginBottom: 12 }}>プロファイル分析結果</h1>
            <p style={{ fontFamily: C.fontBody, fontSize: 14, color: C.textMuted, marginBottom: 24 }}>{userName} さん（{userEmail}）</p>
            {result.type_code && <TypeBadge label={result.type_code} description={result.type_name || ""} />}
          </div>

          {result.summary && (
            <div style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #121210 100%)", border: "1px solid #e8c54722", borderRadius: 16, padding: "28px 32px", marginBottom: 40, animation: "fadeUp 0.8s ease 0.1s both" }}>
              <p style={{ fontFamily: C.fontBody, fontSize: 15, color: "#c0c0c0", lineHeight: 2, margin: 0 }}>{result.summary}</p>
            </div>
          )}

          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>STYLE PROFILE</div>
            <SpectrumResult label="思考スタイル" leftLabel="Deep Focus（集中型）" rightLabel="Talk-through（対話型）" value={sp.focus_dialogue?.score ?? 50} color={colors[0]} />
            <SpectrumResult label="情報処理" leftLabel="Concrete（具体型）" rightLabel="Abstract（抽象型）" value={sp.concrete_abstract?.score ?? 50} color={colors[1]} />
            <SpectrumResult label="リスク姿勢" leftLabel="Steady（安定志向）" rightLabel="Challenge（挑戦志向）" value={sp.conservative_adventurous?.score ?? 50} color={colors[2]} />
            <SpectrumResult label="作業様式" leftLabel="Plan（計画型）" rightLabel="eXplore（探索型）" value={sp.planning_exploration?.score ?? 50} color={colors[3]} />
            {Object.entries(sp).map(([key, val], i) => {
              if (!val?.insight) return null;
              const labels = { focus_dialogue: "思考スタイルの詳細", concrete_abstract: "情報処理の詳細", conservative_adventurous: "リスク姿勢の詳細", planning_exploration: "作業様式の詳細" };
              return <InsightCard key={key} title={labels[key] || key} text={val.insight} icon={["🔍", "🧩", "⚡", "🗺️"][i]} delay={200 + i * 150} />;
            })}
          </div>

          {result.tech_values && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>TECHNICAL VALUES</div>
              {result.tech_values.core_belief && (
                <div style={{ textAlign: "center", padding: "24px 32px", background: C.card, border: "1px solid #e8c54733", borderRadius: 12, marginBottom: 20 }}>
                  <div style={{ fontFamily: C.fontMono, fontSize: 10, color: "#6a6a6a", marginBottom: 10, letterSpacing: 2 }}>CORE BELIEF</div>
                  <div style={{ fontFamily: C.fontBody, fontSize: 18, fontWeight: 600, color: C.gold, lineHeight: 1.6 }}>「{result.tech_values.core_belief}」</div>
                </div>
              )}
              <InsightCard title="コード品質への哲学" text={result.tech_values.quality_philosophy || ""} icon="✨" delay={100} />
              <InsightCard title="問題解決パターン" text={result.tech_values.problem_solving_pattern || ""} icon="🔧" delay={250} />
              <InsightCard title="トレードオフ判断の傾向" text={result.tech_values.tradeoff_tendency || ""} icon="⚖️" delay={400} />
            </div>
          )}

          {/* 自由記述の表示 */}
          {(result.freetext_responses?.tech_passion || result.freetext_responses?.team_episode) && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>CANDIDATE'S OWN WORDS</div>
              {result.freetext_responses.tech_passion && (
                <InsightCard title="技術者としてのこだわり（本人記述）" text={result.freetext_responses.tech_passion} icon="💬" delay={100} />
              )}
              {result.freetext_responses.team_episode && (
                <InsightCard title="チーム開発エピソード（本人記述）" text={result.freetext_responses.team_episode} icon="📝" delay={250} />
              )}
            </div>
          )}

          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>COLLABORATION & LEARNING</div>
            {result.collaboration && <InsightCard title={`協働スタイル（${result.collaboration.score ?? "—"}/100）`} text={`${result.collaboration.style || ""}\n\n強み: ${result.collaboration.strength || ""}`} icon="🤝" delay={100} />}
            {result.learning && <InsightCard title={`学習パターン（${result.learning.score ?? "—"}/100）`} text={`${result.learning.pattern || ""}\n\n${result.learning.depth_vs_breadth || ""}`} icon="📚" delay={250} />}
          </div>

          {result.interview_suggestions?.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>INTERVIEW SUGGESTIONS</div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px" }}>
                <p style={{ fontFamily: C.fontBody, fontSize: 13, color: "#6a6a6a", marginBottom: 16, marginTop: 0 }}>面談で深掘りすべきポイント：</p>
                {result.interview_suggestions.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: C.fontMono, fontSize: 12, color: C.gold, flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontFamily: C.fontBody, fontSize: 14, color: "#b0b0b0", lineHeight: 1.8 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {GAS_WEBHOOK_URL && (
            <div style={{ textAlign: "center", marginBottom: 24, fontFamily: C.fontMono, fontSize: 11, color: sheetSaved ? "#5a8a4a" : C.textDark }}>
              {sheetSaved ? "✓ スプレッドシートに保存済み" : "スプレッドシートに保存中..."}
            </div>
          )}

          <div style={{ padding: "20px 24px", background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 32 }}>
            <p style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textDark, lineHeight: 1.8, margin: 0 }}>※ 本結果は自己申告に基づくルールベースの分析であり、実務パフォーマンスを直接保証するものではありません。連続尺度の傾向を示すものであり、能力の優劣を判定するものではありません。面談の対話材料としてご活用ください。</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => { setPhase("intro"); setCurrentQ(0); setAnswers({}); setResult(null); setSheetSaved(false); }}
              style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#6a6a6a", padding: "12px 32px", borderRadius: 8, fontFamily: C.fontBody, fontSize: 14, cursor: "pointer" }}>
              最初からやり直す
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
