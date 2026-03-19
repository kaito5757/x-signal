import "../src/env";
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";
import { subDays, format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const JST = "Asia/Tokyo";

const TOPICS: Record<string, string> = {
  "claude-code": "Claude Code (Anthropic CLI tool)",
  cursor: "Cursor (AI code editor)",
};

function getJSTDates() {
  const now = new TZDate(new Date(), JST);
  const yesterday = subDays(now, 1);
  return {
    yesterday: format(yesterday, "yyyy-MM-dd"),
    today: format(now, "yyyy-MM-dd"),
  };
}

async function collectTopic(
  topicKey: string,
  topicQuery: string,
): Promise<void> {
  const { yesterday, today } = getJSTDates();

  console.log(`Collecting: ${topicKey} (${yesterday})`);

  const { text } = await generateText({
    model: xai.responses("grok-4.20-beta-latest-non-reasoning"),
    prompt: `Search X/Twitter for posts about "${topicQuery}" posted on ${yesterday} (JST).

## ルール
- いいね数が最低500以上の投稿を優先（該当が少ない場合はいいね数100以上まで緩和）
- いいね数・エンゲージメントが高い順に最大5件を選出（5件未満でもOK。条件を満たす投稿があるだけ掲載すること。0件の場合のみ「該当なし」と記載）
- すべて日本語で出力すること（投稿内容の引用も含め、英語や他の言語は必ず日本語に翻訳すること）
- 投稿内容をそのまま載せるのではなく、分かりやすく解説すること

## 除外すべき投稿
- 勉強会・イベントの参加報告（「楽しかった！」だけで具体的な情報がないもの）
- 明らかな宣伝・アフィリエイト目的の投稿
- 単なるリツイートや引用のみで独自の情報がないもの

## 優先すべき投稿
- 新機能・アップデート情報
- 具体的な技術Tips・ベストプラクティス
- 業界動向・分析
- 実践的なユースケースや具体的な成果報告

## 検索の注意
- 必ず複数のキーワード・クエリで検索を試みること（英語・日本語の両方で検索）
- 1回の検索で見つからなくても諦めず、別のキーワードや表現で再検索すること
- 関連するハッシュタグや略称でも検索すること

## 出力フォーマット
以下のmarkdown形式で出力してください（\`\`\`markdown や \`\`\` は含めないこと）:

---
title: "${yesterday}"
description: ${yesterday} のトレンドツイートまとめ
---

## TOP 5 ツイート

### 1. 投稿のタイトル（内容を端的に表す日本語タイトル）

| 項目 | 詳細 |
|------|------|
| 投稿者 | Display Name (@handle) |
| エンゲージメント | ❤️ X / 🔁 X / 💬 X |
| リンク | [元ポスト](URL) |

**投稿内容:**

> 投稿の内容を引用（日本語以外の場合は日本語に翻訳して記載）
> スレッドに続きがある場合は、すべてのツイートを含めること

**解説:**

投稿内容（スレッド全体を含む）を日本語で分かりやすく解説する。英語の投稿は翻訳した上で、背景知識や文脈も補足して読者が理解しやすいようにする。技術的な内容は噛み砕いて説明する。

---

### 2. ...

（5つ繰り返す）

`,
    tools: {
      x_search: xai.tools.xSearch({
        fromDate: yesterday,
        toDate: today,
      }),
    },
  });

  if (!text.trim()) {
    console.error(`No content returned for ${topicKey}`);
    return;
  }

  let markdown = text;

  if (!markdown.startsWith("---")) {
    markdown = `---
title: "${yesterday}"
description: ${yesterday} のトレンドツイートまとめ
---

${markdown}`;
  }

  const dir = join(process.cwd(), "content", "docs", topicKey);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const filePath = join(dir, `${yesterday}.mdx`);
  writeFileSync(filePath, markdown, "utf-8");
  console.log(`Saved: ${filePath}`);
}

async function main() {
  for (const [key, query] of Object.entries(TOPICS)) {
    await collectTopic(key, query);
  }
  console.log("Done!");
}

main().catch(console.error);
