// ============================================================
// Google Apps Script - アセスメント結果をスプレッドシートに保存
// ============================================================
// 使い方:
//   1. Google スプレッドシートを新規作成
//   2. 「拡張機能」→「Apps Script」を開く
//   3. このコードを貼り付けて保存
//   4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」を選択
//   5. アクセス権限:「全員」に設定 → デプロイ
//   6. 表示されたURLを Vercel環境変数 VITE_GAS_URL にセット
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();

    // --- シート1: 概要 ---
    var summarySheet = sheet.getSheetByName("概要");
    if (!summarySheet) {
      summarySheet = sheet.insertSheet("概要");
      summarySheet.appendRow([
        "タイムスタンプ",
        "候補者名",
        "メールアドレス",
        "タイプコード",
        "タイプ名",
        "サマリー",
        "思考スタイル",
        "情報処理",
        "リスク姿勢",
        "作業様式",
        "協働スコア",
        "学習スコア",
        "核となる信念",
        "面談ポイント1",
        "面談ポイント2",
        "面談ポイント3"
      ]);
      summarySheet.getRange(1, 1, 1, 16).setFontWeight("bold");
      summarySheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);
    var sp = data.style_profile || {};
    var tv = data.tech_values || {};
    var co = data.collaboration || {};
    var le = data.learning || {};
    var suggestions = data.interview_suggestions || [];

    summarySheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.candidate_name || "",
      data.candidate_email || "",
      data.type_code || "",
      data.type_name || "",
      data.summary || "",
      sp.focus_dialogue ? sp.focus_dialogue.score : "",
      sp.concrete_abstract ? sp.concrete_abstract.score : "",
      sp.conservative_adventurous ? sp.conservative_adventurous.score : "",
      sp.planning_exploration ? sp.planning_exploration.score : "",
      co.score || "",
      le.score || "",
      tv.core_belief || "",
      suggestions[0] || "",
      suggestions[1] || "",
      suggestions[2] || ""
    ]);

    // --- シート2: 回答生データ ---
    var rawSheet = sheet.getSheetByName("回答データ");
    if (!rawSheet) {
      rawSheet = sheet.insertSheet("回答データ");
      rawSheet.appendRow([
        "タイムスタンプ", "候補者名", "タイプコード",
        "質問ID", "回答"
      ]);
      rawSheet.getRange(1, 1, 1, 5).setFontWeight("bold");
      rawSheet.setFrozenRows(1);
    }

    var ts = data.timestamp || new Date().toISOString();
    var candidateName = data.candidate_name || "";
    var typeCode = data.type_code || "";
    var answers = data.answers || {};

    var answerKeys = Object.keys(answers);
    for (var i = 0; i < answerKeys.length; i++) {
      var qId = answerKeys[i];
      var answer = answers[qId];
      var answerStr = Array.isArray(answer) ? answer.join(", ") : String(answer);
      rawSheet.appendRow([ts, candidateName, typeCode, qId, answerStr]);
    }

    // --- シート3: 詳細分析 ---
    var detailSheet = sheet.getSheetByName("詳細分析");
    if (!detailSheet) {
      detailSheet = sheet.insertSheet("詳細分析");
      detailSheet.appendRow([
        "タイムスタンプ", "候補者名", "メールアドレス",
        "タイプコード", "全分析JSON"
      ]);
      detailSheet.getRange(1, 1, 1, 5).setFontWeight("bold");
      detailSheet.setFrozenRows(1);
    }

    detailSheet.appendRow([
      ts, candidateName, data.candidate_email || "",
      typeCode, JSON.stringify(data, null, 0)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Assessment webhook is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
