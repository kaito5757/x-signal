---
name: collect
description: Xトレンドツイートの収集を実行する
user_invocable: true
---

# トレンドツイート収集スキル

## 現在の状態

収集済みファイル（Claude Code）:
!`ls content/docs/claude-code/*.mdx | sort`

収集済みファイル（Cursor）:
!`ls content/docs/cursor/*.mdx | sort`

今日の日付:
!`date +%Y-%m-%d`

## 手順

1. 上記の収集済みファイルを確認し、まだ今日の日付のファイルがなければ収集を実行する
2. 収集コマンド: `npx tsx scripts/collect.ts`
3. 特定の日付を収集する場合: `COLLECT_DATE=YYYY-MM-DD npx tsx scripts/collect.ts`
4. 収集完了後、生成されたファイルの内容を確認し、問題がなければ `git add` と `git commit` を行う
5. コミットメッセージは既存のフォーマットに合わせる: `📡 YYYY-MM-DD のトレンドツイートを追加`
