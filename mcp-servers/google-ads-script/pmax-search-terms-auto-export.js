/**
 * Google Ads Script: PMAX検索語句レポート自動エクスポート
 *
 * 設置方法:
 *   1. Google広告管理画面 → ツールと設定 → 一括操作 → スクリプト
 *   2. 「+新しいスクリプト」をクリック
 *   3. このスクリプトの内容を貼り付け
 *   4. SPREADSHEET_ID を確認（既に設定済み）
 *   5. 「承認」→「実行」でテスト
 *   6. 「スケジュール」→「毎日」に設定（推奨: 午前6時）
 *
 * 出力先: https://docs.google.com/spreadsheets/d/1Qw41z2YXJSbTRSj0ohIFBHw9SQdrFmIzi24KyTVSuxU
 * シート名: 検索語句レポート
 *
 * エクスポート内容:
 *   - 検索語句
 *   - キャンペーン名
 *   - 表示回数
 *   - クリック数
 *   - 費用
 *   - コンバージョン
 *   - コンバージョン値
 *   - CTR
 *   - CVR
 *   - CPC
 *   - CPA
 */

var SPREADSHEET_ID = '1Qw41z2YXJSbTRSj0ohIFBHw9SQdrFmIzi24KyTVSuxU';
var SHEET_NAME = '検索語句レポート';

// 日付範囲: 実行日の前日から遡って30日間（LAST_30_DAYS は暦月解釈になるため明示的に計算）
var today = new Date();
var endDate = new Date(today);
endDate.setDate(today.getDate() - 1);
var startDate = new Date(today);
startDate.setDate(today.getDate() - 30);
var fmt = function(d) { return Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy-MM-dd'); };
var DATE_START = fmt(startDate);
var DATE_END = fmt(endDate);

function main() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  // シートをクリアして新しいデータで上書き
  sheet.clear();

  // ヘッダー行
  var headers = [
    '検索語句',
    'キャンペーン',
    '表示回数',
    'クリック数',
    'CTR(%)',
    '費用(円)',
    'CPC(円)',
    'コンバージョン',
    'コンバージョン値(円)',
    'CVR(%)',
    'CPA(円)',
    'エクスポート日',
    '期間'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // レポート期間の情報
  var dateStr = Utilities.formatDate(today, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm');

  // Google Ads レポートクエリ（GAQL）
  var query =
    'SELECT ' +
    '  search_term_view.search_term, ' +
    '  campaign.name, ' +
    '  metrics.impressions, ' +
    '  metrics.clicks, ' +
    '  metrics.ctr, ' +
    '  metrics.cost_micros, ' +
    '  metrics.average_cpc, ' +
    '  metrics.conversions, ' +
    '  metrics.conversions_value, ' +
    '  metrics.cost_per_conversion ' +
    'FROM search_term_view ' +
    'WHERE segments.date BETWEEN \'' + DATE_START + '\' AND \'' + DATE_END + '\' ' +
    '  AND metrics.impressions > 0 ' +
    'ORDER BY metrics.impressions DESC ' +
    'LIMIT 5000';

  var rows = [];

  try {
    var report = AdsApp.search(query);

    while (report.hasNext()) {
      var row = report.next();

      var searchTerm = row.searchTermView.searchTerm || '';
      var campaignName = row.campaign.name || '';
      var impressions = row.metrics.impressions || 0;
      var clicks = row.metrics.clicks || 0;
      var ctr = (row.metrics.ctr * 100).toFixed(2);
      var costMicros = row.metrics.costMicros || 0;
      var cost = costMicros / 1000000;  // micros → 円
      var avgCpc = row.metrics.averageCpc ? row.metrics.averageCpc / 1000000 : 0;
      var conversions = row.metrics.conversions || 0;
      var convValue = row.metrics.conversionsValue || 0;
      var cvr = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '0.00';
      var cpa = conversions > 0 ? (cost / conversions).toFixed(0) : '-';

      rows.push([
        searchTerm,
        campaignName,
        impressions,
        clicks,
        ctr,
        Math.round(cost),
        Math.round(avgCpc),
        conversions.toFixed(1),
        Math.round(convValue),
        cvr,
        cpa,
        dateStr,
        DATE_START + ' 〜 ' + DATE_END
      ]);
    }

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      Logger.log('エクスポート完了: ' + rows.length + '行の検索語句を書き込みました');
    } else {
      sheet.getRange(2, 1).setValue('データなし（期間: ' + DATE_START + ' 〜 ' + DATE_END + '）');
      Logger.log('検索語句データが見つかりませんでした');
    }

  } catch (e) {
    Logger.log('エラー: ' + e.message);
    sheet.getRange(2, 1).setValue('エラー: ' + e.message);
  }

  // 列幅自動調整
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  Logger.log('PMAX検索語句レポート自動エクスポート完了: ' + dateStr);
}
